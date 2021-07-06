import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Route,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert
} from "react-native";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { ScrollView } from "react-native-gesture-handler";
import HTML from "react-native-render-html";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NumericInput from "react-native-numeric-input";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import * as EmailValidator from "email-validator";

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;
interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}
interface IEvent {
  id: string;
  imageUrl: any;
  title: string;
  content: string;
  date:string;
  time:string;
  restaurant :string;
  price : number;
  infoline:string,
  freeconfirm:boolean,
  itid:string
}

export const EventScreen = ({ route, navigation }: Props) => {
  const [html, setHtml] = useState()
  const [event, setEvent] = useState<IEvent>();
  const [resaid, setResaId] = useState(null)
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [crenModalVisible, setCrenModalVisible] = useState(false);
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [numcover, setNumcover] = useState(1)
  const [loading, setLoading] = useState(false);
  const [isResaConfirmed, setIsResaConfirmed] = useState(false)
  const [paymentchoice, setPaychoice] = useState(null);

  const [keyboard, setKeyboard] = useState(0)
  const [offset, setOffset] = useState(0)
  
  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");
  const tagsStyles = {
    p: { fontFamily: "geometria-regular", fontSize: 18, color: textColor },
  };

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
async function prepareFetch(){
  var Event = Parse.Object.extend("Event");
    let eventRaw = new Event();
    eventRaw.id = route.params.eventId;
     setHtml(eventRaw.attributes.description)
    setEvent({
      id: eventRaw.id || "",
      imageUrl: eventRaw?.attributes.image?._url || "",
      content: eventRaw.attributes.description || " a",
      title: eventRaw.attributes.title || "",
      date: moment(eventRaw.attributes.date).format("dddd DD MMM") || "",
      time: moment(eventRaw.attributes.date).format("HH:mm") || "",
      restaurant: eventRaw.attributes.intcust.attributes.corporation || "",
      price: eventRaw.attributes.price || "",
      infoline: eventRaw.attributes.infoline || "",
      freeconfirm:  eventRaw.attributes.freeconfirm || null,
      itid:  eventRaw.attributes.intcust.id || true,
    });
    var Intcust = Parse.Object.extend("Intcust")
    let IntcustRaw = new Intcust()
    IntcustRaw.id = eventRaw.attributes.intcust.id
    await IntcustRaw.fetch()
    setPaychoice(IntcustRaw.attributes.paymentChoice)
}
  useEffect(() => {
    prepareFetch()
  }, []);

  useEffect(() => {
    const k1 = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboard(e.endCoordinates.height)
    })
    const k2 = Keyboard.addListener('keyboardDidHide', () => { setKeyboard(0); setOffset(0)})
    return() => {
      k1.remove()
      k2.remove()
    }
  }, [])

  const reset = () => {
    setFirstname('')
    setLastname('')
    setPhone('')
    setEmail('')
  }

  return (
    <View style={styles.container}>
      <Modal
        isVisible={crenModalVisible}
        onModalHide={reset}
        onSwipeComplete={(e) => setCrenModalVisible(false)}
        onBackButtonPress={() => setCrenModalVisible(false)}
        onBackdropPress={() => setCrenModalVisible(false)}
        style={{
          padding: 0,
          margin: 0,
          ...(Platform.OS !== "android" && {
            zIndex: 10,
          }),
          backgroundColor:backgroundColor,
          position:'absolute',
          bottom: offset > 0 && keyboard > 0 ? keyboard - offset : 0,
          width:'100%',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          height: 530
        }}
      >
          
          <View
            style={{
              backgroundColor:backgroundColor,
              padding: 20,
              borderRadius: 10,
              elevation: 10,
              ...(Platform.OS !== "android" && {
                zIndex: 100,
              })
            }}
          >
            {
              !isResaConfirmed &&
              <>
                <Text style={{fontFamily:'geometria-regular'}}>
                  Prénom(s)
                </Text>
                <TextInput
                  onFocus={() => setOffset(300)}
                  style={[styles.textInput,{color:textColor, fontFamily:"geometria-regular"}]}
                  value={firstname}
                  onChangeText={text => setFirstname(text)}
                />
                <Text style={{fontFamily:'geometria-regular'}}>
                  Nom de famille
                </Text>
                <TextInput
                  onFocus={() => setOffset(225)}
                  style={[styles.textInput,{color:textColor, fontFamily:"geometria-regular"}]}
                  value={lastname}
                  onChangeText={text => setLastname(text)}
                />
                <Text style={{fontFamily:'geometria-regular'}}>
                  Numéro de portable
                </Text>
                <TextInput
                  onFocus={() => setOffset(155)}
                  style={[styles.textInput,{color:textColor, fontFamily:"geometria-regular"}]}
                  value={phone}
                  onChangeText={text => setPhone(text)}
                />
                <Text style={{fontFamily:'geometria-regular'}}>
                  Adresse email
                </Text>
                <TextInput
                  onFocus={() => setOffset(80)}
                  style={[styles.textInput,{color:textColor, fontFamily:"geometria-regular"}]}
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
                  <Text style={{fontFamily:'geometria-regular'}}>
                  Nombre de places
                </Text>
                        <NumericInput
                  minValue={1}
                  value={numcover}
                  textColor={textColor}
                  containerStyle={{ marginLeft: 20, marginTop: 10 }}
                  onChange={(value) => setNumcover(value)}
                />
                <Text style={{fontFamily:'geometria-regular', marginTop:20}}>
                Vous allez être redirigé vers la page de paiement {paymentchoice == "stripeOptin" ? "Stripe" :"Payplug" } pour régler : {numcover * (event?.price || 0)}€TTC
                </Text>
              </>
            }
            {
              isResaConfirmed &&
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <MaterialIcons name="check-circle-outline" size={150} color='rgb(0, 209, 73)'/>
                <Text style={{marginTop: 20, marginBottom: 10, fontWeight:'bold', fontSize: 18}}>Réservation confirmée</Text>
                <Text style={{fontWeight:'bold', marginBottom: 10, color: '#ff5050'}}>Numéro de réservation</Text>
                <Text style={{fontWeight:'bold', color: '#ff5050'}}>{resaid}</Text>
                <Text>Notez-le et conservez-le</Text>
              </View>
            }
          </View>
        <TouchableOpacity
          onPress={async () => {
            if (EmailValidator.validate(email) == false) {
              Alert.alert("Vérifiez le format de votre adresse email.")
            }

            if(isResaConfirmed){
              navigation.navigate('TablesScreen')
              setCrenModalVisible(false)
            }
            else if (!isResaConfirmed && EmailValidator.validate(email) == true) {
              // TO DO
              // payant ou gratuit 
              var Reservation = Parse.Object.extend("Reservation")
              let reservationRaw = new Reservation()
              var Event = Parse.Object.extend("Event")
              let eventRaw = new Event()
              eventRaw.id = route.params.eventId
              var Intcust = Parse.Object.extend("Intcust")
              let IntcustRaw = new Intcust()
              IntcustRaw.id = event?.itid
              let params = {
                email: email,
                itid: IntcustRaw.id,
              };
              const res = await Parse.Cloud.run("getGuest", params);
              var Guest = Parse.Object.extend("Guest");
              let guestRaw = new Guest();
              if (res.length == 0) {
                guestRaw.set("firstname", firstname);
                guestRaw.set("lastname", lastname);
                guestRaw.set("email", email);
                await guestRaw.save();
              } else if (res.length > 0) {
                guestRaw.id = res[0].id;
              }
              let arrayGuest = [
                {
                  firstname: firstname,
                  lastname: lastname,
                  mobilephone: phone,
                  email: email,
                },
              ];
              reservationRaw.set("guest", guestRaw) 
              reservationRaw.set("guestFlat", arrayGuest) 
              reservationRaw.set("event",eventRaw) 
              reservationRaw.set("intcust",IntcustRaw) 
              reservationRaw.set("OnWaitingList",false) 
              reservationRaw.set("engagModeResa","Event") 
              await reservationRaw.save()
              if(event?.freeconfirm==true){
              // si gratuit create resa
          
           
              
              let params = {
                myresid: reservationRaw.id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                itid: event.itid,
                note : "",
                agreed : true,
                numguest:numcover
              };
              const res = await Parse.Cloud.run("editRes4FreeDisco", params);

              setResaId(res.id)
              setIsResaConfirmed(true)
              const params40 = {
                itid: event.itid,
              };
              const employeesOfIntcust = await Parse.Cloud.run("getEmployees", params40);
                  employeesOfIntcust.map(async (user:any) => {
        const params50 = {
          employeeId: user.id,
        };
        const installationsOfEmployee = await Parse.Cloud.run("getInstallationsOfEmployees", params50);
                          installationsOfEmployee.map( (installation:any) => {
                            const params10 = {
                              token: installation.attributes.deviceToken,
                              title: 'Vous avez une nouvelle réservation sur TABLE',
                              body: 'Au nom de ' + firstname+' '+ lastname +  ', '+numcover+   ' couverts pour votre évènement ' + event.title + '. Faites chauffer les casseroles !',
                            };
                            Parse.Cloud.run("sendPush", params10);
                          })
                    })
              }else {
              // si payant go to payment payplug ou stripe 
              if (IntcustRaw.attributes.paymentChoice !== "stripeOptin") {
                const params1 = {
                  itid: IntcustRaw.id,
                  winl: "www.tablebig.com",
                  resaid: reservationRaw.id,
                  customeremail: email,
                  customerfirstname: firstname,
                  customerlastname: lastname,
                  customerphone: phone,
                  type: "order",
                  amount: (event?.price || 0) * numcover ,
                  apikeypp: IntcustRaw.attributes.apikeypp,
                  mode: 'Event',
                  noukarive:false,
                  toutalivrer:false

                  
                };
                const response = await Parse.Cloud.run(
                  "getPayPlugPaymentUrlRN",
                  params1
                );
                setCrenModalVisible(false)

                // navigate and options payLink
                navigation.navigate("paymentScreen", {
                  restoId: IntcustRaw.id,
                  paylink: response,
                  bookingType: "Event",
                  resaId: reservationRaw.id,
                  amount: event?.price,
                });
              } else if (IntcustRaw.attributes.paymentChoice == "stripeOptin") {

                let params = {
                  stripeAccount: IntcustRaw.attributes.stripeAccId,
                  amount:(event?.price || 0) * numcover ,
                  customeremail: email,
                  name: firstname + lastname,
                  resaid: reservationRaw.id,
                  mode: "Event",
                  paidType: "order",
                  noukarive:false,
                  toutalivrer:false
                };
      
            
                const {
                  paymentIntent,
                  ephemeralKey,
                  customer,
                } = await Parse.Cloud.run("stripeCheckoutForRN", params);
  

                let ERR = {};
                setCrenModalVisible(false)

                ERR = await initPaymentSheet({
                  merchantDisplayName: IntcustRaw.attributes.corporation,
                  customerId: customer,
                  customerEphemeralKeySecret: ephemeralKey,
                  paymentIntentClientSecret: paymentIntent,
                });
      
                if (!ERR) {
                  setLoading(true);
                }
      
                let clientSecret = paymentIntent;
                const { error } = await presentPaymentSheet({
                  clientSecret,
                });
      
                if (error) {
                  if (error.code == "Canceled") {
                    Alert.alert("Paiement annulé");
                  } else {
                    Alert.alert(`Error code: ${error.code}`, error.message);
                  }
                } else {
                  Alert.alert("Paiement réussi.");
                  navigation.navigate("successScreen", {
                    bookingType: 'Event',
                    resaId: reservationRaw.id,
                    amount: event?.price,
                  });
                }
                setPaymentSheetEnabled(false);
                setLoading(false);
              }
              }
            }
          }}
          style={styles.appButtonContainer}
          disabled={!isResaConfirmed && (!firstname || !lastname || !phone || !email)}
        >
          <Text style={styles.appButtonText}>{isResaConfirmed?'Revenir à l\'accueil' : 'Confirmer'}</Text>
        </TouchableOpacity>
      </Modal>
      <ScrollView style={styles.wrap}>
        {!event?.imageUrl ||
          (event.imageUrl == "" && (
            <View style={styles.wrapindicator}>
              <ActivityIndicator size="large" color="#F50F50" />
            </View>
          ))}
        <Image
          source={{
            uri: event?.imageUrl || "https://storage.googleapis.com/tablereports/dc8122fc87e947474c7afbae6c1258b0_diner.jpeg",
          }}
          style={styles.image}
          resizeMode="cover"
        ></Image>
        <View style={{top:-40, borderTopLeftRadius:20,borderTopRightRadius:20, paddingTop:20}}>
        <Text style={styles.title}>{event?.title} </Text>
        <Text style={styles.subtitle2}>{event?.restaurant}</Text>
        <Text style={styles.subtitle}>{event?.date} - {event?.time}</Text>
        <Text style={styles.subtitle2}>Tarif unique : {event?.price}€TTC</Text>
        <Text style={styles.subtitle2}>Infoline : {event?.infoline}</Text>

        <View style={styles.wrapwebview}>
          <HTML
            source={{ html: html || " a" }}
            tagsStyles={tagsStyles}
            contentWidth={400}
          />
        </View>


        </View>
      </ScrollView>
      <TouchableOpacity
            onPress={() => {
                setCrenModalVisible(true);
            }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Réservez</Text>
          </TouchableOpacity>

          </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  wrap: {
    flex: 1,
  },
  appButtonContainer: {
  //  elevation: 8,
    marginBottom: 20,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal:20,
    fontFamily:'geometria-regular',
  },
  wrapwebview: {
    flex: 1,
    width: "90%",
    
    marginLeft: 20,
  },
  webview: {
    flex: 1,
    width: "100%",
    fontSize: 18,
    color: "white",
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
fontFamily:"geometria-bold",
    alignSelf: "center",
  },
  title: {
    fontSize: 25,
    marginLeft: 20,
    marginTop: 20,
    marginBottom:20,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
  },
  subtitle: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom:20,
    flexWrap: "wrap",
    fontFamily: "geometria-regular",
  },
  subtitle2: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    marginBottom:10,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
  },
  text: {
    fontSize: 16,
    padding: 4,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  wrapindicator: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: 300,
  },
  btnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 25,
    color: "white",
    backgroundColor: "#ff5050",
  },
  btn: {
    height: 50,
    width: 50,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
  textInput: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1
  }
});

export default EventScreen;

