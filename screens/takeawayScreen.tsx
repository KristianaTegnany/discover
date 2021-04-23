import { NavigationState } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, Image, Route, Text,ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import {  View } from '../components/Themed';
//import {  ListItem } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import { ListItem} from 'react-native-elements'
import { useSelector } from 'react-redux';
import {  ProductItem } from '../global';

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface ICats { id: string, title: string, order:number}
interface IMenus {  id: string, price:number,imageUrl: string,  title: string, order:number, description:string, category:string}

export const takeawayScreen = ({ route, navigation}: Props) => {
  const [cats, setCats] = useState <ICats[] > ();
  const [menus, setMenus] = useState <IMenus[] > ();
  const [totalCashBasket, setTotalCashBasket] = useState (0);
  const [totalQuantityBasket, setTotalQuantityBasket] = useState (0);
  const products = useSelector((state: ProductItem[]) => state);

  const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, 'background');
  const textColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
   
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
  
   function getCountOfMenusOfcat(cattitle:string) {
  if(menus){
      let count = menus.filter((x:any)=>x.category==cattitle).length
      return count;
  }
}

  async function fetchCatsAndMenus() {
    var Intcust = Parse.Object.extend("Intcust");
  let intcust = new Intcust;
  intcust.id = route.params.restoId;
  var rawCats = intcust.attributes.subcatIm;
  const sortedCats = rawCats.sort(function(a:any, b:any){
    if(a.order < b.order) { return -1; }
    if(a.order > b.order) { return 1; }   
  })
  setCats(sortedCats);

  let params = {
    itid: route.params.restoId,
  }
 var rawMenus =  await Parse.Cloud.run("getMenusActive", params);

 rawMenus=  rawMenus.map((menu:any)=>({
   "id":menu.id,
   "price":menu.attributes.price,
"title": menu.attributes.title,
"category": menu.attributes.category,
"order": menu.attributes.order,
"imageUrl": menu.attributes.image && menu.attributes.image._url || ''
 }))

    const sortedMenu= rawMenus.sort(function(a:any, b:any){
      if(a.order < b.order) { return -1; }
      if(a.order > b.order) { return 1; }
  })
setMenus(sortedMenu);
 }

 async function sum(array:any, key:any) {
  return array.reduce((a:any, b:any) => a + (b[key] || 0), 0);
 }

 async function calculusTotalCashBasket() {
  let sumRaw =0
   products.map(product => {
    sumRaw = sumRaw + product.quantity * product.price
  });
  setTotalCashBasket(sumRaw);

}

async function calculusTotalQuantityBasket() {
  let sumRaw = await sum(products, 'quantity');
  setTotalQuantityBasket(sumRaw);
}

useEffect(() => {
  calculusTotalCashBasket();
  calculusTotalQuantityBasket();
  fetchCatsAndMenus();

}, [products]);


  return (
    <View style={styles.container}>
      <ListItem  bottomDivider 
             containerStyle={{ backgroundColor: backgroundColor, borderColor:"transparent" }}
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
                  <ListItem.Title style={{marginTop:9, color: textColor, fontSize: 18, fontFamily:'geometria-bold'}}>  
       Voir le panier </ListItem.Title>
                  <ListItem.Subtitle style={{marginTop:2, color: textColor, fontSize: 16, fontFamily:'geometria-regular'}}>
                  {totalQuantityBasket} article.s - {totalCashBasket} €</ListItem.Subtitle>
        
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
       <ScrollView style={styles.wrapperScroll}>
   <View>
   {!cats || !menus && 
   [''].map(() => {
   <View key="123"  style = {styles.wrapindicator}>
   <ActivityIndicator  size="large" color="#F50F50" />
   </View>    
   })}
       {cats && menus && 
   cats.map((cat) => {
     if(getCountOfMenusOfcat(cat.title)!==0){
    return   <View key={cat.title+ 'view'}>
    <ListItem key={cat.title} bottomDivider  
    containerStyle={{backgroundColor:"#ff5050", borderColor:"#ff5050"}}>
    <ListItem.Content>
      <ListItem.Title style = {styles.textcattitle}>  
{cat.title} </ListItem.Title>
    </ListItem.Content>
  </ListItem>    

            {menus.map((menu) => {
                   if(menu.category==cat.title){
            return    <View key={cat.id + menu.id}>            
            <ListItem key={cat.id + menu.id } bottomDivider  
                   containerStyle={{ backgroundColor: backgroundColor }}
            onPress = {
              () => {
               navigation.navigate('DishScreen', {
                  restoId: route.params.restoId,
                  bookingType: route.params.bookingType,
                  day: route.params.day,
                  hour: route.params.hour,
                  menuid: menu.id
                });
              }
            } > 
     
      <ListItem.Content>
      <ListItem.Title style={{marginTop:5, color: textColor, fontSize: 20, fontFamily:'geometria-bold'}}>{menu.title} </ListItem.Title> 
 
        <ListItem.Subtitle style={{marginTop:2, color: textColor, fontSize: 18, fontFamily:'geometria-regular'}}>
        {menu.price} €</ListItem.Subtitle>

      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
    
    </View>
                   }
            })}
  
</View>
     }
   })
   }</View>



              </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  //  flex: 1,
  //  alignItems: 'center',
    justifyContent: 'center',
  },
 
  textcattitle:{
color:"#fff",
fontWeight: 'bold',
    fontFamily: "geometria-bold",
  },
  FlatList: {
    width: '100%',
    marginLeft:0,
    paddingLeft:0,
  },
  wrapperScroll:{
height:'90%'
  },
  title: {
    fontSize: 20,
    padding:30,
    fontWeight: 'bold',
    fontFamily: "geometria-bold",
  },
  text: {
    fontSize: 16,
    padding: 4,
    fontWeight: 'bold',
    fontFamily: "geometria-bold",
  },
  minitext: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  dishComponent: {
    height: 120,

  },
  wrapindicator:{
    alignItems: 'center',
    height:'100%',
  justifyContent: 'center',
   },
  image: {
   flex: 1,
   width:400,
paddingTop:110,
  },
});

export default takeawayScreen;