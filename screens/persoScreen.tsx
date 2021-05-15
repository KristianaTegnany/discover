import { NavigationState } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Route,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import useColorScheme from "../hooks/useColorScheme";

import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { ListItem } from "react-native-elements";
import moment from 'moment-timezone';
import "moment/locale/fr";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

export const persoScreen = ({ route, navigation }: Props) => {
  const [goto, setGoto] = useState("Aaa");
  const [email, setEmail] = useState();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");

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
    setEmail(email);
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

  async function savePerso() {
    console.log("Sauvegardé.");
  }

  async function toggleMenu(context: any) {}

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      {/* 
   <View style={styles.searchHeader} >
        <TextInput
          placeholder="Saisir votre adresse email"
          style={styles.searchInput}
        // value={search}
        // onChangeText={this.filterResultsSearch}
        ></TextInput>
        <Button onPress={ () => console.log("fff")}
        title={"🔍"}>ffff
    </Button>
    </View>  


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

<TouchableOpacity onPress={() => savePerso()} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText} > <Text style={styles.payText}>Enregistrer</Text> </Text>
  </TouchableOpacity>  */}

      <Text style={styles.textBold}>Besoin d'aide ? </Text>
      <View style={styles.wrappertexts}>
        <Text style={styles.text2Bold}>WhatsApp</Text>
        <Text style={styles.text2}>
          0696 09 22 16 du Lundi au Vendredi de 9h à 17h.{" "}
        </Text>
        <Text style={styles.text2Bold}>Email </Text>
        <Text style={styles.text2}>
          hello@tablebig.com du Lundi au Vendredi de 9h à 17h.{" "}
        </Text>
      </View>
      {false && (
        <View style={styles.wrapindicator}>
          <ActivityIndicator size="large" color="#F50F50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  alignItems: 'center',
    justifyContent: "flex-start",
  },
  wrappertexts: {
    padding: 10,
  },
  textBold: {
    marginTop: 50,
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    paddingLeft: 0,
    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
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
    height: 120,
    //  alignSelf: "stretch",
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
    // marginBottom: 47,
    // marginTop: -252
  },
});

export default persoScreen;
