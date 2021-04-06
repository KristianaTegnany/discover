import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import {Button, Image, Route, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}
type state = { restaurant: any };

export default class RestoScreen  extends React.Component<Props,state>   {
  restaurantCast :any[] = [];


  constructor(Props:any) {
    super(Props)
    this.state = {     
      restaurant :this.restaurantCast
        };
      }

  async componentDidMount() {
    console.log("Start")
    }

      render() {
        var Intcust = Parse.Object.extend("Intcust");
      let myintcust = new Intcust;
      myintcust.id = this.props.route.params.restoId;
     console.log(myintcust);

  return (
    <View style={styles.container}>
       
          <Image
            source={{
              uri: myintcust.attributes.overviewpic._url ,
            }}
            resizeMode="cover"
            style={styles.image}
            
          ></Image>
      <Text style={styles.title}>{myintcust.attributes.corporation}  </Text>

      <Text style={styles.text}>{myintcust.attributes.introwebsite}  {myintcust.attributes.overviewpic._url}  </Text>
     
      <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('RestoScreen',
              { text: 'Hello!' });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Réservez</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('RestoScreen',
              { text: 'Hello!' });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Commandez à emporter</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('RestoScreen',
              { text: 'Hello!' });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Commandez en livraison</Text>
  </TouchableOpacity>


    </View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appButtonContainer:{
    elevation: 8,
    marginBottom :4,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12

  },
  appButtonText:{
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"

  },
  title: {
    fontSize: 40,
    padding:30,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    padding: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
   flex: 1,
  width:400,
  height:300,

   // marginBottom: 47,
   // marginTop: -252
  },
  
});
