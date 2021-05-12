import { NavigationState } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import * as React from "react";
import {
  Alert,
  Button,
  Image,
  Route,
  StyleSheet,
  TextInput,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import moment from "moment";
import NumericInput from "react-native-numeric-input";
import * as EmailValidator from "email-validator";

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export const resaScreen = ({ route, navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [notecom, setNote] = useState("");
  const [nbcover, setNbCouver] = useState(0);

  const [myintcust, setMyintcust] = useState({
    id: "",
    onsite_shift: 0,
    corporation: "",
    EngagModeOnSite: false,
    onsitenoonblock: "",
    onsitenightblock: "",
    onsite_maxguestbyday: 0,
    onsite_maxresbycren: 0,
  });

  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");

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
  async function onChangeTextEmail(email: any) {
    setEmail(email.trim().toLowerCase());
  }

  async function onChangeTextFirstname(firstname: any) {
    setFirstname(firstname);
  }
  async function onChangeTextLastname(lastname: any) {
    setLastname(lastname);
  }
  async function onChangeTextPhone(phone: any) {
    setPhone(phone);
  }
  async function onChangeTextNote(note: any) {
    setNote(note);
  }

  async function onChangeTextNbCouverts(nbcover: any) {
    setNbCouver(nbcover);
  }

  async function goResa() {
    console.log("go resa");
    let blockGo = false;

    if (email) {
      if (EmailValidator.validate(email) == false) {
        blockGo = true;
        Alert.alert(
          "Merci de vérifier votre adresse email. Le format est incorrect."
        );
      }
    }

    if (!firstname || !lastname || !phone || !nbcover || nbcover == 0) {
      Alert.alert(
        "Merci de saisir tous les champs obligatoires, ainsi qu'un nombre de couvert supérieur à 0. "
      );
      blockGo = true;
    }
    // controler le nombre de places dispo sur la journée
    console.log(myintcust.id);
    console.log(route.params.day);
    console.log(route.params.hour);

    let starttime = moment(route.params.day)
      .clone()
      .hours(route.params.hour.substring(0, 2))
      .minute(route.params.hour.substring(3));
    console.log(starttime);

    let params01 = {
      itid: myintcust.id,
      dateres: starttime.toDate(),
      shift: myintcust.onsite_shift,
    };
    const coversForCren = await Parse.Cloud.run(
      "getReservationsSafeOnsiteByDateAndCren",
      params01
    );
    console.log("coversForCren" + coversForCren);
    console.log("onsite_shift" + myintcust.onsite_shift);

    console.log(
      "myintcust.onsite_maxresbycren" + myintcust.onsite_maxresbycren
    );
    if (
      blockGo == false &&
      coversForCren + nbcover > myintcust.onsite_maxresbycren
    ) {
      blockGo = true;
      Alert.alert(
        "Vous avez été coiffé au poteau ! Il n'y a plus de places pour ce créneau, vous pouvez en choisir un autre en revenant en arrière. "
      );
      navigation.navigate("hourSelectScreen", {
        bookingType: "Onsite",
        restoname: myintcust.corporation,
        day: route.params.day,
        nbcover: nbcover,
        name: lastname,
      });
    }
    let params3 = {
      itid: myintcust.id,
      date: starttime.format(),
    };
    const numOfGuestsForDay = await Parse.Cloud.run(
      "getNumOfGuestsForDay",
      params3
    );
    console.log("numOfGuestsForDay" + numOfGuestsForDay);
    console.log(
      "myintcust.onsite_maxguestbyday" + myintcust.onsite_maxguestbyday
    );

    if (numOfGuestsForDay + nbcover > myintcust.onsite_maxguestbyday) {
      blockGo = true;
      Alert.alert(
        "Vous avez été coiffé au poteau ! Il n'y a plus de places pour ce jour, vous pouvez en choisir un autre en revenant en arrière. "
      );
      navigation.navigate("crenSelectScreen", {
        bookingType: "Onsite",
        restoname: myintcust.corporation,
        nbcover: nbcover,
        name: lastname,
      });
    }
    if (blockGo == false) {
      const Guest = Parse.Object.extend("Guest");
      const Intcust = Parse.Object.extend("Intcust");

      var query = new Parse.Query(Guest);
      query.equalTo("email", email);
      return query
        .first()
        .then(async (result: any) => {
          if (typeof result == "undefined") {
            let guest = new Guest();
            guest.set("firstname", firstname);
            guest.set("lastname", lastname);
            guest.set("mobilephone", phone);
            guest.set("email", email);
            let it = new Intcust();
            it.id = myintcust.id;
            guest.set("intcust", it);
            await guest.save();
            let Reservation = Parse.Object.extend("Reservation"); //

            let res = new Reservation();
            res.set("guest", guest);
            await guest.fetch();
            let arrayGuest = [
              {
                firstname: guest.attributes.firstname,
                lastname: guest.attributes.lastname,
                mobilephone: guest.attributes.mobilephone,
                email: guest.attributes.email,
              },
            ];
            res.set("intcust", it);
            res.set("guestFlat", arrayGuest);
            res.set("process", "selfcare");
            res.set("numguest", nbcover);
            res.set("withapp", true);
            res.set("engagModeResa", "SurPlace");
            res.set("date", moment(route.params.day).hours(route.params.hour.substring(0, 2)).minutes(route.params.hour.substring(3)).toDate()); // j'ai ajouté l'heure à la date
            res.set("notes", notecom);
            res.set("status", "Confirmé"); // en cours
            await res.save();
            return res;
          } else {
            result.set("firstname", firstname);
            result.set("lastname", lastname);
            result.set("mobilephone", phone);
            result.set("email", email);
            result.set("notes", notecom);
            let it = new Intcust();
            it.id = myintcust.id;
            result.set("intcust", it);
            await result.save();
            let Reservation = Parse.Object.extend("Reservation"); //
            let res = new Reservation();
            res.set("guest", result);
            await result.fetch();
            let arrayGuest = [
              {
                firstname: result.attributes.firstname,
                lastname: result.attributes.lastname,
                mobilephone: result.attributes.mobilephone,
                email: result.attributes.email,
                vegan: result.attributes.vegan,
                gluten: result.attributes.gluten,
                casher: result.attributes.casher,
                hallal: result.attributes.hallal,
                nuts: result.attributes.nuts,
                seafruits: result.attributes.seafruits,
                other: result.attributes.other,
                birthday: result.attributes.birthday,
              },
            ];
            res.set("guestFlat", arrayGuest);
            res.set("numguest", nbcover);
            res.set("intcust", it);
            res.set("notes", notecom);
            res.set("withapp", true);
            res.set("engagModeResa", "SurPlace");
            res.set("date", moment(route.params.day).toDate());
            res.set("process", "selfcare");
            res.set("status", "Confirmé"); //
            await res.save();
            return res;
          }
        })
        .then(
          (res: any) => {
            navigation.navigate("successScreen", {
              bookingType: "Onsite",
              resaId: res.id,
              restoname: myintcust.corporation,
              hour: route.params.hour,
              nbcover: nbcover,
              name: lastname,
            });

            return Promise.resolve(res);
          },
          (error: any) => {
            console.log(error);
            return error;
          }
        );
    }
  }
  useEffect(() => {
    var Intcust = Parse.Object.extend("Intcust");
    let myintcust = new Intcust();
    myintcust.id = route.params.restoId;
    let intcustRawX = [
      {
        id: myintcust.id || "",
        corporation: myintcust.attributes.corporation || "",
        onsite_shift: myintcust.attributes.onsite_shift || 0,
        EngagModeOnSite: myintcust.attributes.EngagModeOnSite || false,
        onsitenoonblock: myintcust.attributes.onsitenoonblock || "",
        onsitenightblock: myintcust.attributes.onsitenightblock || "",
        onsite_maxguestbyday: myintcust.attributes.onsite_maxguestbyday || 0,
        onsite_maxresbycren: myintcust.attributes.onsite_maxresbycren || 0,
      },
    ];
    setMyintcust(intcustRawX[0]);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre de couverts</Text>

        <NumericInput
          textColor={textColor}
          containerStyle={{ marginLeft: 20, marginTop: 10 }}
          onChange={(value) => onChangeTextNbCouverts(value)}
        />

        <Text style={styles.label}>Votre adresse email</Text>
        <TextInput
          style={{
            color: textColor,
            fontFamily: "geometria-regular",
            height: 50,
            marginHorizontal: 20,
            marginTop: 4,
            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 15,
            borderColor: "grey",
          }}
          onChangeText={onChangeTextEmail}
          placeholder="addresse@email.com"
          value={email}
        />
        <Text style={styles.label}>Votre prénom</Text>

        <TextInput
          style={{
            color: textColor,
            fontFamily: "geometria-regular",
            height: 50,
            marginHorizontal: 20,
            marginTop: 4,
            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 15,
            borderColor: "grey",
          }}
          onChangeText={onChangeTextFirstname}
          placeholder="Gustavo"
          value={firstname}
        />

        <Text style={styles.label}>Votre nom de famille</Text>

        <TextInput
          style={{
            color: textColor,
            fontFamily: "geometria-regular",
            height: 50,
            marginHorizontal: 20,
            marginTop: 4,
            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 15,
            borderColor: "grey",
          }}
          onChangeText={onChangeTextLastname}
          placeholder="Martin"
          value={lastname}
        />

        <Text style={styles.label}>Votre numéro de portable</Text>

        <TextInput
          style={{
            color: textColor,
            fontFamily: "geometria-regular",
            height: 50,
            marginHorizontal: 20,
            marginTop: 4,
            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 15,
            borderColor: "grey",
          }}
          onChangeText={onChangeTextPhone}
          placeholder="069X 00 00 00"
          value={phone}
        />

        <Text style={styles.label}>Note / Commentaire - Non obligatoire</Text>

        <TextInput
          style={{
            color: textColor,
            fontFamily: "geometria-regular",
            height: 50,
            marginHorizontal: 20,
            marginTop: 4,
            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 15,
            borderColor: "grey",
          }}
          onChangeText={onChangeTextNote}
          placeholder="abc"
          value={notecom}
        />

        <TouchableOpacity
          onPress={() => goResa()}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>
            {" "}
            <Text style={styles.payText}>Valider la réservation</Text>{" "}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  payText: {
    alignSelf: "center",
    color: "white",
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
  appButtonText: {
    alignContent: "space-between",
    display: "flex",
    fontSize: 18,
    //  color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  title: {
    fontSize: 20,
    padding: 30,
    fontWeight: "bold",
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
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
    // marginBottom: 47,
    // marginTop: -252
  },
  label: {
    marginHorizontal: 20,
    fontFamily: "geometria-regular",
    marginTop: 20,
  },
});

export default resaScreen;
