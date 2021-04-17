import { NavigationState } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, Image, Route, Text,ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import {  View } from '../components/Themed';
import { ListItem} from 'react-native-elements'

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface ICats { id: string, title: string, order:number}
interface IMenus {  id: string, price:number, title: string, order:number, description:string, category:string}

export const takeawayScreen = ({ route, navigation}: Props) => {
  const [cats, setCats] = useState <ICats[] > ();
  const [menus, setMenus] = useState <IMenus[] > ();

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
 }))

    const sortedMenu= rawMenus.sort(function(a:any, b:any){
      if(a.order < b.order) { return -1; }
      if(a.order > b.order) { return 1; }
  })
setMenus(sortedMenu);
 }


useEffect(() => {
  fetchCatsAndMenus();
}, []);


  return (
    <View style={styles.container}>
      <ListItem  bottomDivider onPress = {
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
                  <ListItem.Title style = {styles.text}>  
       Voir le panier </ListItem.Title>
                  <ListItem.Subtitle style = {styles.minitext}>
                  4 articles - €</ListItem.Subtitle>
        
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
    <ListItem key={cat.title} bottomDivider  containerStyle={{backgroundColor:"#ff5050"}}>
    <ListItem.Content>
      <ListItem.Title style = {styles.textcattitle}>  
{cat.title} </ListItem.Title>
    </ListItem.Content>
  </ListItem>    

            {menus.map((menu) => {
                   if(menu.category==cat.title){
            return    <View key={cat.id + menu.id}>            
            <ListItem key={cat.id + menu.id } bottomDivider  onPress = {
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
        <ListItem.Title style = {styles.text}>  
{menu.title} </ListItem.Title>
        <ListItem.Subtitle style = {styles.minitext}>
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