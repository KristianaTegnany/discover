import { NavigationState } from "@react-navigation/native";
import React from "react";
import {
  Route,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";

import { NavigationScreenProp } from "react-navigation";
import { Text, View } from "../components/Themed";
import "moment/locale/fr";

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

export const persoScreen = ({ route, navigation }: Props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.textBold}>Besoin d'aide ? </Text>
        <View style={styles.wrappertexts}>
          <Text style={styles.text2}>
            Notre objectif est de vous permettre de vivre votre amour des
            restaurants de la manière la plus agréable possible. Si vous
            souhaitez remonter un bug ou proposer une amélioration, n'hésitez
            pas à nous écrire directement sur Whatsapp ou nous envoyer un email,
            les coordonnées sont plus bas. N'hésitez pas à joindre des copies
            d'écran.{" "}
          </Text>
          <Text style={styles.text2Bold}>A venir</Text>
          <Text style={styles.text2}>
            - Compte utilisateur pour sauvegarder vos informations.{" "}
          </Text>
          <Text style={styles.text2}>- Codes Promos. </Text>
          <Text style={styles.text2}>- Programme de Fidélité. </Text>
        </View>
        <View style={styles.wrappertexts}>
          <Text style={styles.text2Bold}>WhatsApp</Text>
          <Text style={styles.text2}>
            0696 45 04 45 du Lundi au Vendredi de 9h à 17h.{" "}
          </Text>
          <Text style={styles.text2Bold}>Email </Text>
          <Text style={styles.text2}>
            hello@tablebig.com du Lundi au Vendredi de 9h à 17h.{" "}
          </Text>

          <Text style={styles.text2Bold}>
            Vous souhaitez inscrire votre restaurant ?{" "}
          </Text>
          <Text style={styles.text2}>
            Rendez-vous sur www.tablebig.com. Inscrivez-vous et on vous
            rappelle.{" "}
          </Text>

          <Text style={styles.text2Bold}>En savoir plus sur TABLE </Text>
          <Text style={styles.text2}>
            TABLE est concu et opéré en Martinique, avec la Guadeloupe aussi
            dans le coeur. Accompagné par Le Village By CA. Soutenu par la CTM,
            notamment à travers le dispositif "Plas Dijital" et par la CCIM.{" "}
          </Text>
          <Text style={styles.text2}>
            TABLE DISCOVER est une application mobile et un site internet pour
            tous les amoureux de la bonne cuisine et des restaurants. Nous
            souhaitons devenir un "media marchand" sur le Fooding lifeStyle.{" "}
          </Text>
          <Text style={styles.text2}>
            TABLE BIG est une suite logicielle complète pour la gestion de
            restaurant couvrant tout le processus Client & Marketing jusqu'à
            l'encaissement. Notre objectif est d'aider plus de 10 000
            restaurants d'ici 2025 à se développer.{" "}
          </Text>

          <Text style={styles.text2}>
            Nous recrutons des développeurs MEAN ou React Native, des
            commerciaux, des experts Marketing, des contributeurs amoureux du
            Fooding : hello@tablebig.com.
          </Text>

          <Text style={styles.text2}>
            Responsable de publication : Satyam Dorville - 0696 45 04 45{" "}
          </Text>
        </View>
        {false && (
          <View style={styles.wrapindicator}>
            <ActivityIndicator size="large" color="#F50F50" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  wrappertexts: {
    padding: 10,
  },
  textBold: {
    marginTop: Platform.OS === 'ios' ? 50 : 40,
    fontFamily: "geometria-bold",
    fontSize: 18,
    paddingHorizontal: 20,
  },
  label: {
    marginHorizontal: 20,
    fontFamily: "geometria-regular",
    marginTop: 20,
  },
  searchHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    width: "83%",
    marginTop: 60,
    marginRight: "auto",
    backgroundColor: "#f4f4f4",
    color: "black",
    marginLeft: "auto",
    paddingRight: 20,
    marginBottom: 10,
    alignSelf: "baseline",
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1,
  },
  searchInput: {
    width: 239,
    height: 40,
    color: "#000",
    marginRight: 1,
    marginLeft: 9,
    fontSize: 14,
    fontFamily: "geometria-regular",
  },
  textstrong: {
    fontFamily: "geometria-bold",
    paddingVertical: 20,
    fontSize: 18,
    paddingLeft: 4,
  },
  wrapindicator: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  FlatList: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0
  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 10,
    marginTop: 30,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 20,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  payText: {
    alignSelf: "center",
    color: "white",
  },
  appButtonText: {
    alignContent: "space-between",
    display: "flex",
    fontSize: 18,
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  title: {
    fontSize: 20,
    padding: 30
  },
  text: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  text2: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
    marginHorizontal: 10,
    marginTop: 10,
  },
  text2Bold: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-bold",
    marginHorizontal: 10,
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  dishComponent: {
    height: 120
  },
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110
  },
});

export default persoScreen;
