import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Route, StyleSheet,Image,  TextInput } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { useSelector } from "react-redux"
import { ProductItem } from '../global';
import { useEffect } from 'react';
import { useState } from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons'; 
import moment from 'moment';


interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export const custInfoScreen = ({ route, navigation}: Props) => {
  const [email, setEmail] = useState();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();

  const [resa, setResa] = useState({ 
    id:'', 
    engagModeResa:'',
    guestFlat:[{email:''}]
  });
  const [paylink, setPaylink] = useState();
  const [totalCashBasket, setTotalCashBasket] = useState (0);
  const [intcust, setIntcust] = useState({ 
    id:'', 
    apikeypp:'',
    paymentChoice:'',
    option_DeliveryByNoukarive:false,
    option_DeliveryByToutAlivrer: false, 
    stripeAccId: ''
  });
  const products = useSelector((state: ProductItem[]) => state);

  const textColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
  ) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];
  
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return Colors[theme][colorName];
    }
  }
  async function onChangeTextEmail(email:any) {
setEmail(email.trim().toLowerCase());
  }
  
  async function onChangeTextFirstname(firstname:any) {
    setFirstname(firstname);
      }
      async function onChangeTextCity(city:any) {
        setCity(city);
          }
          async function onChangeTextZip(zip:any) {
            setZip(zip);
              }
              async function onChangeTextline1(line1:any) {
                setLine1(line1);
                  }
      async function onChangeTextLastname(lastname:any) {
        setLastname(lastname);
          }
          async function onChangeTextPhone(phone:any) {
            setPhone(phone);
              }
  async function createResa() {  
   
    let params = {
      email: email,
      itid: intcust.id
    };
  
    const res = await Parse.Cloud.run("getGuest", params);
  
     var Guest = Parse.Object.extend("Guest");
     let guestRaw = new Guest();
     if(res.length==0){  
    guestRaw.set("firstname",firstname);
    guestRaw.set("lastname",lastname);
    guestRaw.set("email",email);
   await  guestRaw.save();
 
  }else if(res.length>0){
    guestRaw.id = res[0].id
  }

  var Reservation = Parse.Object.extend("Reservation");
    let resaRaw = new Reservation();
    resaRaw.set("date",moment(route.params.day).toDate());
    resaRaw.set("guest",guestRaw);
    let arrayGuest = [{
      "firstname": firstname,
      "lastname": lastname,
      "mobilephone": phone,
      "email": email,
    }];

     resaRaw.set("guestFlat", arrayGuest);
     resaRaw.set("status", "En cours"); // en cours
    resaRaw.set("engagModeResa",route.params.bookingType);
   
   await resaRaw.save();
    setResa({
      'id' : resaRaw.id || '',
      'engagModeResa':resaRaw.attributes.engagModeResa || '',
      'guestFlat':resaRaw.attributes.guestFlat ||[]
    });
  }

  async function calculusTotalCashBasket() {

    let sumRaw =0;
     products.map(product => {
      sumRaw = sumRaw + product.quantity * product.amount
    })
    setTotalCashBasket(sumRaw);
  }

  async function goPay() {
    if(email && firstname && lastname && phone){
       createResa(); 
     if(intcust.paymentChoice!=="stripeOptin"  ){

    await  getPayPlugPaymentUrl();
// navigate and options payLink
navigation.navigate('paymentScreen',
{ restoId: route.params.restoId , paylink: paylink, bookingType:route.params.bookingType });   
     }
   else if(intcust.paymentChoice=="stripeOptin"){


      const params1 = {
        itid: intcust.id ,
        winl: "http://www.amazon.com",
        resaid: resa.id,
        paidtype: "order",
        customeremail: "satyam.dorville@gmail.com",
        type: "order",
        amount: totalCashBasket,
        mode: resa.engagModeResa,
        noukarive: intcust.option_DeliveryByNoukarive,
        toutalivrer: intcust.option_DeliveryByToutAlivrer,
       stripeAccount :intcust.stripeAccId
      };
      const session = await Parse.Cloud.run("createCheckoutSessionStripeForApp", params1);

navigation.navigate('paymentStripeScreen',
{ CHECKOUT_SESSION_ID: session.id , STRIPE_PUBLIC_KEY: "pk_test_9xQUuFXcOEHexlaI2vurArT200gKRfx5Gl" });        
  }}else{
    alert("Merci de saisir tous les champs. ")
  }
  }
  async function getPayPlugPaymentUrl() {
    const params1 = {
      itid: intcust.id,
      winl: "window.location.host",
      resaid: "34dUynZnXC",
      customeremail: email,
      customerfirstname: firstname,
      customerlastname: lastname,
      customerphone: phone,
      type: "order",
      amount: 100,
      apikeypp: intcust.apikeypp,
      mode: route.params.bookingType,
      noukarive: intcust.option_DeliveryByNoukarive,
      toutalivrer: intcust.option_DeliveryByToutAlivrer,
    };

    const response = await Parse.Cloud.run("getPayPlugPaymentUrl", params1);
 
    setPaylink(response);
  }


      useEffect(() => {
  var Intcust = Parse.Object.extend("Intcust");
  let intcustRaw = new Intcust();
  intcustRaw.id = route.params.restoId;

  let intcustRawX =[{
    'id': intcustRaw.id,
    'apikeypp': intcustRaw.attributes.apikeypp || '', 
    'paymentChoice' :intcustRaw.attributes.paymentChoice || '', 
    'option_DeliveryByNoukarive': intcustRaw.attributes.option_DeliveryByNoukarive || false,
    'option_DeliveryByToutAlivrer': intcustRaw.attributes.option_DeliveryByToutAlivrer || false,
    'stripeAccId': intcustRaw.attributes.stripeAccId || ''
  }];

  setIntcust(intcustRawX[0]);
  calculusTotalCashBasket();

      }, []);

  return (
    <ScrollView>

    <View style={styles.container}> 
        <View style={styles.container2}> 
      <Text style={styles.label}>Votre adresse email</Text>
     <TextInput
         style={{color: textColor, fontFamily:'geometria-regular',
         height: 50,
         marginHorizontal:20,
         marginTop:4,
         paddingLeft: 20,
         borderWidth: 1,
         borderRadius:10,
         fontSize:15,
         borderColor: "grey"}}
        onChangeText={onChangeTextEmail}
        placeholder="addresse@email.com"
        value={email}
      />
      <Text style={styles.label}>Votre prénom</Text>

       <TextInput
        style={{color: textColor, fontFamily:'geometria-regular',
        height: 50,
        marginHorizontal:20,
        marginTop:4,
        paddingLeft: 20,
        borderWidth: 1,
        borderRadius:10,
        fontSize:15,
        borderColor: "grey"}}
        onChangeText={onChangeTextFirstname}
        placeholder="Gustavo"
        value={firstname}
      />      

<Text style={styles.label}>Votre nom de famille</Text>

        <TextInput
        style={{color: textColor, fontFamily:'geometria-regular',
        height: 50,
        marginHorizontal:20,
        marginTop:4,
        paddingLeft: 20,
        borderWidth: 1,
        borderRadius:10,
        fontSize:15,
        borderColor: "grey"}}        
        onChangeText={onChangeTextLastname}
        placeholder="Martin"
        value={lastname}
      />     

<Text style={styles.label}>Votre numéro de portable</Text>

           <TextInput
        style={{color: textColor, fontFamily:'geometria-regular',
        height: 50,
        marginHorizontal:20,
        marginTop:4,
        paddingLeft: 20,
        borderWidth: 1,
        borderRadius:10,
        fontSize:15,
        borderColor: "grey"}}
        onChangeText={onChangeTextPhone}
        placeholder="+59X 69X 00 00 00"
        value={phone}
      />   

{route.params.BookingType=="Delivery" && 
<View>
<Text style={styles.label}>L'adresse à laquelle vous souhaitez être livré</Text>

<TextInput
style={{color: textColor, fontFamily:'geometria-regular',
height: 50,
marginHorizontal:20,
marginTop:4,
paddingLeft: 20,
borderWidth: 1,
borderRadius:10,
fontSize:15,
borderColor: "grey"}}
onChangeText={onChangeTextline1}
placeholder="5 rue des accacias"
value={line1}
/>   

<Text style={styles.label}>Code Postal</Text>

           <TextInput
        style={{color: textColor, fontFamily:'geometria-regular',
        height: 50,
        marginHorizontal:20,
        marginTop:4,
        paddingLeft: 20,
        borderWidth: 1,
        borderRadius:10,
        fontSize:15,
        borderColor: "grey"}}
        onChangeText={onChangeTextZip}
        placeholder="97200"
        value={zip}
      />   


<Text style={styles.label}>Ville</Text>

           <TextInput
        style={{color: textColor, fontFamily:'geometria-regular',
        height: 50,
        marginHorizontal:20,
        marginTop:4,
        paddingLeft: 20,
        borderWidth: 1,
        borderRadius:10,
        fontSize:15,
        borderColor: "grey"}}
        onChangeText={onChangeTextCity}
        placeholder="Fort-de-france"
        value={city}
      />   
</View>
}
      <TouchableOpacity onPress={() => goPay()} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText} > <Text style={styles.payText}>Valider et payer</Text> </Text>
  

  </TouchableOpacity> 
 {intcust && intcust.paymentChoice=="stripeOptin" &&
  <Text style={styles.appButtonText} > Avec <FontAwesome5 name="cc-stripe" size={24} color={textColor}  /> </Text>

 }
 {intcust && intcust.paymentChoice!=='stripeOptin' &&
  <Text style={styles.appButtonText} > Avec <Image
  source={require('../assets/images/pplogo.png')}
  fadeDuration={0}
  style={{ width: 90, height: 50 }}
/>
 </Text>
 }
  </View>

  <TouchableOpacity style = {styles.listitem}  onPress={() => {
              navigation.navigate('termsScreen',
              { restoId: route.params.restoId , 
                bookingType:route.params.bookingType
              })}}> 
     
       <Text style = {styles.text}>En continuant j'accepte les CGU 👀➡️ </Text>
       
   </TouchableOpacity>
    </View></ScrollView>
);
}

const styles = StyleSheet.create({
  label:{
    marginHorizontal:20,
    fontFamily: "geometria-regular",
    marginTop:20,
  },
  input: {
    height: 50,
    marginHorizontal:20,
    marginTop:4,
    paddingLeft: 20,
    borderWidth: 1,
    fontFamily: "geometria-regular",
    borderRadius:10,
    fontSize:15,
    borderColor: "grey"
  },
  inputContainer:{
    marginTop:4,
    borderBottomWidth:0,
  },
  container: {
    flex: 1,
  },
  container2:{
    
//    paddingTop : 30

  },
  payText:{
    alignSelf: 'center',
    color:'white'
  },
  listitem:{
padding:5,
alignItems:"center",
  },
  appButtonContainer:{
    elevation: 8,
    marginBottom :10,
    marginTop:30,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight :20,
    marginLeft :20,
    paddingVertical: 13,
    paddingHorizontal: 14
  },
  appButtonText:{
    alignContent: 'space-between',
    display:"flex",
    fontSize: 18,
  //  color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  minitext: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1
  },
  
 
  title: {
  //  flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    padding:20,
    fontFamily: "geometria-bold",
    fontWeight: 'bold',
  },
  textBold:{
    flex:1,
    fontSize: 16,
    top:0,
    fontFamily: "geometria-bold",
    fontWeight: 'bold',
    padding: 20
  },
  textRaw:{
    flex:1,
    fontSize: 16,
    top:0,
    fontFamily: "geometria-regular",
  },
  text: {
   // flex:1,
    fontSize: 16,
    top:0,
    margin:"auto",
    fontFamily: "geometria-regular",

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  
});

export default custInfoScreen;