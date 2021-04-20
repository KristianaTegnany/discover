import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import {Button, Image, Route, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';

interface NavigationParams {
  restoId: string;
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
    }

      render() {
        var Intcust = Parse.Object.extend("Intcust");
      let myintcust = new Intcust;
      myintcust.id = this.props.route.params.restoId;


  return (
    <View style={styles.container}> 
    {myintcust.attributes.overviewpic &&
          <Image style={styles.image}
          source={{uri: myintcust.attributes.overviewpic._url}}
          />
    }
<ScrollView>
      <Text style={styles.title}>{myintcust.attributes.corporation}  </Text>
       <Text style={styles.text}>{myintcust.attributes.introwebsite}    </Text>
       </ScrollView>
{myintcust.attributes.EngagModeOnSite &&
      <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('crenSelectScreen',
              { restoId: myintcust.id , bookingType:"OnSite" });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Réservez sur place</Text>
  </TouchableOpacity>
}

{myintcust.attributes.EngagModeTakeAway &&
  <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('crenSelectScreen',
              { restoId: myintcust.id , bookingType:"TakeAway" });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Commandez à emporter</Text>
  </TouchableOpacity>
      }

{myintcust.attributes.EngagModeTakeAway &&
  <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('crenSelectScreen',
              { restoId: myintcust.id , bookingType:"Delivery" });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Commandez en livraison</Text>
  </TouchableOpacity>
      }

    </View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  image:{
    height:'20%',
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

    padding: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  
});
