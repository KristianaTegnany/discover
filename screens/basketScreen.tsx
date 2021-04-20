import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Route, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { useSelector } from "react-redux"

import { ProductItem } from '../global';
import { Avatar, ListItem } from 'react-native-elements';
import { useEffect } from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { add, remove, store } from '../store';

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
  const [totalCashBasket, setTotalCashBasket] = useState (0);
  const [totalQuantityBasket, setTotalQuantityBasket] = useState (0);

  const products = useSelector((state: ProductItem[]) => state);


 
  async function sum(array:any, key:any) {
    return array.reduce((a:any, b:any) => a + (b[key] || 0), 0);
   }
  
  async function calculusTotalCashBasket() {
    // doit prendre en compte les quantités dans le sum ma gueule ba ouais c mon comportement
    let sumRaw =0
     products.map(product => {
      sumRaw = sumRaw + product.quantity * product.price
    })
    setTotalCashBasket(sumRaw);
  }
  async function calculusTotalQuantityBasket() {
    let sumRaw = await sum(products, 'quantity');
    setTotalQuantityBasket(sumRaw);
  }
  

      useEffect(() => {
        calculusTotalCashBasket();
        calculusTotalQuantityBasket();
      }, [products]);

    

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
                  {totalQuantityBasket} article.s - {totalCashBasket} €</ListItem.Subtitle>
              
                </ListItem.Content>
              </ListItem>
      <ScrollView>
      <View >
        {products
         // .filter(product => product.added)
          .map((product: ProductItem, index) => (
            <ListItem key={product.id + index } bottomDivider> 
            { product && product.imageUrl &&
       <Avatar rounded source={{ uri: product.imageUrl }} />
            }

      <ListItem.Content>
        <ListItem.Title style = {styles.text}>  
{product.title} </ListItem.Title>
        <ListItem.Subtitle  style = {styles.textRaw}>
        {product.price} € </ListItem.Subtitle>

      </ListItem.Content>
      <Ionicons name="remove-circle" style={styles.searchIcon}  onPress={() =>  store.dispatch(remove(product))} />
        <ListItem.Subtitle style = {styles.textQuant} >{product.quantity}</ListItem.Subtitle>
      <Ionicons name="add-circle" style={styles.searchIcon}  onPress={() => store.dispatch(add(product))} />
    </ListItem>
          ))}
      
      </View>
      </ScrollView>
   <TouchableOpacity onPress={() => {
              navigation.navigate('custInfoScreen',
              { restoId: route.params.restoId , bookingType:route.params.bookingType });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>💳 🔐 Continuer</Text>
  </TouchableOpacity> 
  

    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textQuant:{
    fontFamily: "geometria-regular",

  }
  ,
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