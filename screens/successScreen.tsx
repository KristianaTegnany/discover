import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import { Image, Route, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { useEffect } from "react";
import { Divider } from "react-native-elements";
import moment from "moment";
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
  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://media.giphy.com/media/oGO1MPNUVbbk4/giphy.gif",
        }}
        //    resizeMode="cover"
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
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "geometria-regular",
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
    flex: 1,
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
    fontWeight: "bold",
    alignSelf: "center",
    //textTransform: "uppercase",
    fontFamily: "geometria-bold",
  },
  image: {
    width: 400,
    height: 300,
    //    borderRadius: 17,
    padding: 0,
    // margin: 7
  },
  title: {
    //  flex:1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 20,
    fontFamily: "geometria-bold",
    fontWeight: "bold",
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
});

export default successScreen;
