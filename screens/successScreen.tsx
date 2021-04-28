import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Image, Route, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { useSelector } from "react-redux"
import { ProductItem } from '../global';
import { useEffect } from 'react';

interface NavigationParams {
  restoId: string;
  paylink: string
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}

export const successScreen = ({ route, navigation}: Props) => {


      useEffect(() => {
    //    console.log(products);
      }, []);

    

  return (
    <View style ={styles.container}>
  <Image  source={{
              uri: "https://media.giphy.com/media/oGO1MPNUVbbk4/giphy.gif" ,
            }}
        //    resizeMode="cover"
            style={styles.image} 
            
          ></Image>
      <Text style ={styles.title}>Vous êtes une personne formidable</Text>
      <Text style ={styles.title}>Votre numéro de commande :</Text>

      <TouchableOpacity 
       style={styles.appButtonContainer}
            >
    <Text 
     style={{
      fontSize: 16,
      fontWeight: "bold",
      alignSelf: "center",
      fontFamily: "geometria-regular",
    }}
    >Revenir à l'accueil</Text>
  </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appButtonContainer:{
    elevation: 8,
    marginBottom :10,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight :30,
    marginLeft :30,

    paddingVertical: 13,
    paddingHorizontal: 14

  },
  appButtonText:{
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
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    padding:20,
    fontFamily: "geometria-bold",
    fontWeight: 'bold',
  },
  text: {
    flex:1,
    fontSize: 16,
    top:0,
    fontFamily: "geometria-regular",
  },
});

export default successScreen;