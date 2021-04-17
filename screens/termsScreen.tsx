import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Route, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { useSelector } from "react-redux"

import { ProductItem } from '../global';
import { Icon, ListItem } from 'react-native-elements';
import { useEffect } from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { remove, store } from '../store';

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}

export const basketScreen = ({ route, navigation}: Props) => {

  const products = useSelector((state: ProductItem[]) => state);


  async function fetchIntcust() {


  }


      useEffect(() => {
    //    console.log(products);
      }, []);

    

  return (
    <View style={styles.container}> 
     <ListItem  bottomDivider 
     containerStyle={{backgroundColor:"#ff5050"}}
     onPress = {
                        () => {
                         navigation.navigate('basketScreen', {
                            restoId: route.params.restoId,
                            bookingType: route.params.bookingType,
                            day: route.params.day,
                            hour: route.params.hour,
                          });
                        }
                      } >
               <ListItem.Content >
              
                  <ListItem.Subtitle style = {styles.headertext}>
                  articles -  €</ListItem.Subtitle>
        
                </ListItem.Content>
              </ListItem>
      <ScrollView>
      <View >
        {products
         // .filter(product => product.added)
          .map((product: ProductItem) => (
            <ListItem key={product.id } bottomDivider> 
     
      <ListItem.Content>
        <ListItem.Title style = {styles.text}>  
{product.title} </ListItem.Title>
        <ListItem.Subtitle  style = {styles.textRaw}>
        {product.price} €</ListItem.Subtitle>

      </ListItem.Content>
      <Ionicons name="trash" style={styles.searchIcon}  onPress={() => store.dispatch(remove(product))} />
    </ListItem>
          ))}
      
      </View>
      </ScrollView>
   <TouchableOpacity onPress={() => {
              navigation.navigate('crenSelectScreen',
              { restoId: route.params.restoId , bookingType:"Delivery" });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>💳 🔐Valider et payer</Text>
  </TouchableOpacity> 
  <ListItem bottomDivider> 
     
     <ListItem.Content>
       <ListItem.Title style = {styles.text}>  ✔︎ En continuant j'accepte les CGU </ListItem.Title>
       
     </ListItem.Content>
     <Ionicons name="information-circle-outline" style={styles.searchIcon}  />
   </ListItem>

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
    marginTop:30,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight :30,
    marginLeft :30,
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
  headertext:{
    fontFamily: "geometria-bold",
color:"white"
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
    flex:1,
    fontSize: 16,
    top:0,
    fontFamily: "geometria-regular",

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  
});

export default basketScreen;