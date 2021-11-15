import { NavigationState } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Route, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { useEffect } from "react";
import { Divider } from "react-native-elements";
import moment from "moment";
import { useIsFocused } from '@react-navigation/native'

interface NavigationParams {
  restoId: string;
  paylink: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export const successScreen = ({ route, navigation }: Props) => {
  const isFocused = useIsFocused()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  var intervalListener: any = undefined
  var timeoutListener: any = undefined

  let paidConfirmedByPayplug = undefined,
    paidConfirmedByStripe = undefined
  //payplugError = undefined,
  //stripePaymentErrorMessage = undefined

  const subscribe = async () => {
    const Reservation = Parse.Object.extend('Reservation');
    var resa = new Reservation();
    resa.set('id', route.params.resaId);

    await resa.fetch()
    if(resa.get('engagModeResa') === 'SurPlace'){
      clearInterval(intervalListener)
      clearTimeout(timeoutListener)
      setLoading(false)
      return false
    }
    paidConfirmedByPayplug = resa.get('paidConfirmedByPayplug')
    paidConfirmedByStripe = resa.get('paidConfirmedByStripe')
    //payplugError = resa.get('payplugError')
    //stripePaymentErrorMessage = resa.get('paidCostripePaymentErrorMessagenfirmedByPayplug')

    if (isFocused) {
      if (paidConfirmedByPayplug || paidConfirmedByStripe) { // || payplugError || stripePaymentErrorMessage))
        setLoading(false)
        clearTimeout(timeoutListener)
        clearInterval(intervalListener)
      }
      else if (paidConfirmedByPayplug === false || paidConfirmedByStripe === false) {
        setError(true)
        clearTimeout(timeoutListener)
        clearInterval(intervalListener)
      }
    }
  }

  useEffect(() => {
    intervalListener = setInterval(subscribe, 2000);
    timeoutListener = setTimeout(() => {
        Alert.alert("Nous n’avons pas réussi à déterminer avec votre banque l’état de votre paiement. Merci de contacter le 0696450445 pour vérification manuelle")
        clearInterval(intervalListener)
        navigation.navigate("TablesScreen")
    }, 10000)
    return () => clearInterval(intervalListener)
  }, [])

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' />
      <Text style={styles.textSpinner}>En attente de validation ...</Text>
    </View>
  ) : error ? (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.textError}>Erreur de paiement. {'\n\n'} Merci de contacter le support au 0696450445 {'\n'} - Whatsapp de préférence</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://media.giphy.com/media/oGO1MPNUVbbk4/giphy.gif",
        }}
        style={styles.image}
      ></Image>
      <ScrollView>
        <Text style={styles.title}>Vous êtes une personne formidable</Text>

        {route.params.bookingType == "Onsite" && (
          <View>
            <Text style={styles.textBold}>
              Récapitulatif de réservation au restaurant{" "}
              {route.params.restoname}
            </Text>

            <Text style={styles.text}>
              {moment(route.params.day).format("dddd DD MMM")} à{" "}
              {route.params.hour} - {route.params.nbcover} couverts
            </Text>
            <Text style={styles.text}>Au nom de {route.params.name}</Text>

            <Text style={styles.text}>
              Réservation n° {route.params.resaId}
            </Text>
          </View>
        )}
        {(route.params.bookingType == "TakeAway" ||
          route.params.bookingType == "Delivery") && (
            <View>
              <Text style={styles.textBold}>Récapitulatif de commande</Text>
              <Text style={styles.text}>{route.params.amount}€ </Text>
              <Text style={styles.text}>
                {moment(route.params.day).format("dddd DD MMM")} à{" "}
                {route.params.hour}{" "}
              </Text>
              <Text style={styles.text}>
                Votre numéro de commande : {route.params.resaId}
              </Text>
            </View>
          )}
        {(route.params.bookingType == "Event") && (
          <View>
            <Text style={styles.textBold}>Récapitulatif de commande</Text>
            <Text style={styles.text}>{route.params.amount}€ </Text>
            <Text style={styles.text}>
              Votre numéro de commande : {route.params.resaId}
            </Text>
          </View>
        )}
        <Divider style={{ backgroundColor: "#ff50f50", marginVertical: 20 }} />
        <Text style={styles.text}>
          Notez bien votre numéro de réservation, il vous sert de confirmation.
        </Text>
        <Divider style={{ backgroundColor: "#ff50f50", marginVertical: 20 }} />

        <Text style={styles.text}>
          Modifier ou annuler : hello@tablebig.com ou par WhatsApp 0696 09 22
          16.
        </Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.appButtonContainer}
        onPress={() => {
          navigation.navigate("TablesScreen");
        }}
      >
        <Text
          style={{
            fontSize: 16,
            alignSelf: "center",
            color: "white",
            fontFamily: "geometria-bold",
          }}
        >
          Revenir à l'accueil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 10,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight: 30,
    marginLeft: 30,

    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  image: {
    width: 400,
    height: 300,
    padding: 0
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 20,
    fontFamily: "geometria-bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  textBold: {
    flex: 1,
    fontSize: 16,
    marginLeft: 20,
    top: 0,
    fontFamily: "geometria-bold",
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 20,
    top: 0,
    fontFamily: "geometria-regular",
  },
  textSpinner: {
    fontSize: 16,
    margin: 20,
    fontFamily: "geometria-regular"
  },
  textError: {
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
    fontFamily: "geometria-bold",
    color: 'white'
  }
});

export default successScreen;
