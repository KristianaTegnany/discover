import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Route, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { useSelector } from "react-redux"
import { ProductItem } from '../global';
import { useEffect } from 'react';
import { useState } from 'react';
import Stripe from 'stripe';
import {Elements, CardElement} from '@stripe/react-stripe-js';

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


  async function onChangeText() {

  }

  async function createResa() {
    var Guest = Parse.Object.extend("Guest");
    let guestRaw = new Guest();
    guestRaw.set("date","");
    guestRaw.save();

    var Reservation = Parse.Object.extend("Reservation");
    let resaRaw = new Reservation();
    resaRaw.set("date","");
    resaRaw.set("engagModeResa",route.params.bookingType);
   
    resaRaw.save();
    resaRaw.map((x:any)=>({
      'id' : x.id,
      'engagModeResa':x.attributes.engagModeResa,
      'guestFlat':x.attributes.guestFlat
    }))
    setResa(resaRaw);
  }

  async function calculusTotalCashBasket() {
    // doit prendre en compte les quantités dans le sum ma gueule ba ouais c mon comportement
    let sumRaw =0
     products.map(product => {
      sumRaw = sumRaw + product.quantity * product.price
    })
    setTotalCashBasket(sumRaw);
  }

  async function goPay() {
     //  createResa(); and guest
     if(intcust.paymentChoice=="payplugOptin"){
      getPayPlugPaymentUrl();
// navigate and options payLink
navigation.navigate('paymentScreen',
{ restoId: route.params.restoId , paylink: paylink, bookingType:route.params.bookingType });   
     }
   else if(intcust.paymentChoice=="stripeOptin"){


      const params1 = {
        itid: intcust.id ,
        winl: window.location.host,
        resaid: resa.id,
        paidtype: "order",
        customeremail: resa.guestFlat[0].email,
        type: "order",
        amount: totalCashBasket,
        mode: resa.engagModeResa,
        noukarive: intcust.option_DeliveryByNoukarive,
        toutalivrer: intcust.option_DeliveryByToutAlivrer,
       stripeAccount :intcust.stripeAccId
      };
      const session = await Parse.Cloud.run("createCheckoutSessionStripe", params1);

      var stripe = new  Stripe('pk_test_51HMSMIB2aw923XhBAjlVUnus2fvYnq0jgaXKGBpKlzBeazoSfSwBsTCBPt79vmKQiwTAsKud98voORkxQ9H2W5Ao005TmW0VfM');
      }

     // const stripe = require('stripe')(`pk_test_9xQUuFXcOEHexlaI2vurArT200gKRfx5Gl`);
      stripe.redirectToCheckout({
        sessionId: session.id
      })
     // navigate and options payLink
 
    
  }

  async function getPayPlugPaymentUrl() {
 
    const params1 = {
      itid: intcust.id,
      winl: "window.location.host",
      resaid: "34dUynZnXC",
      customeremail: "satyam.dorville@gmail.com",
      customerfirstname: "satyam",
      customerlastname: "dorville",
      customerphone: "0000",
      type: "order",
      amount: 100,
      apikeypp: intcust.apikeypp,
      mode: "Delivery",
      noukarive: false,
      toutalivrer: false,
    };
    const response = await Parse.Cloud.run("getPayPlugPaymentUrl", params1);
    console.log(response);
    setPaylink(response);
  }


      useEffect(() => {
  var Intcust = Parse.Object.extend("Intcust");
  let intcustRaw = new Intcust();
  intcustRaw.id = route.params.restoId;
  intcustRaw.map((x:any)=>({
    'id': x.id,
    'apikeypp': x.attributes.apikeypp, 
    'paymentChoice' : x.attributes.paymentChoice, 
    'option_DeliveryByToutAlivrer': x.attributes.option_DeliveryByToutAlivrer,
    'stripeAccId': x.attributes.stripeAccId
  }))
  setIntcust(intcustRaw);
  calculusTotalCashBasket();


      }, []);

    

  return (
    <View style={styles.container}> 
        <View style={styles.container2}> 

      <Text style={styles.label}>Votre adresse email</Text>
     <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="addresse@email.com"
        value={email}
      />
      <Text style={styles.label}>Votre prénom</Text>

       <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="Gustavo"
        value={email}
      />      

<Text style={styles.label}>Votre nom de famille</Text>

        <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="Martin"
        value={email}
      />     

<Text style={styles.label}>Votre numéro de portable</Text>

           <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="+59X 69X 00 00 00"
        value={email}
      />   

      <TouchableOpacity onPress={() => {
              navigation.navigate('paymentScreen',
              { restoId: route.params.restoId , paylink: paylink, bookingType:"Delivery" });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>💳  Valider et payer 🔐</Text>
  </TouchableOpacity> 
  </View>

  <TouchableOpacity style = {styles.listitem}  onPress={() => {
              navigation.navigate('termsScreen'
              );          
              }}> 
     
       <Text style = {styles.text}>En continuant j'accepte les CGU 👀➡️ </Text>
       
   </TouchableOpacity>
    </View>
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
  appButtonText:{
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
   //textTransform: "uppercase",
    fontFamily: "geometria-bold",

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