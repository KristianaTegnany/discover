import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Alert, Image, Route, StyleSheet } from 'react-native';
import {  ListItem } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { add, store } from '../store';
import { useEffect } from 'react';
import { useState } from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';


interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface IMenu {id: string; imageUrl:any; title : string; description : string; formulaChoiced : [], persoMenu:[], price : number}
//interface IPersoMenu {name: string, values :[ {value : string,checked: boolean}]}

export const DishScreen = ({ route, navigation}: Props) => {
  const [menu, setMenu] = useState <IMenu>();
  const [persoMenu, setPersoMenu] = useState <any[]>();
  const [formulaChoiced, setFormulaChoiced] = useState<any[]> ();
  const [checkboxBackColor, setcheckboxBackColor] = useState ('transparent');
  const [checkboxBorderColor, setcheckboxBorderColor] = useState ('grey');

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

  async function fetchMenu() {
    var Menu = Parse.Object.extend("Menu");
    let menu  = new Menu;
    menu.id = route.params.menuid;
await menu.fetch();

let menuRaw =
{ id :menu.id,
  imageUrl:  (menu.attributes.image && menu.attributes.image._url ) || false,
  title : menu.attributes.title,
  description : menu.attributes.description,
  formulaChoiced : menu.attributes.formulaChoice ||[],
  persoMenu : menu.attributes.persoMenu,
  price : Number(menu.attributes.price),
  quantity : 1,
  resto:menu.attributes.intcust.id
 }
       setMenu(menuRaw);
       let persoMenuRaw=[{}];
       persoMenuRaw.pop();
  menuRaw.persoMenu.map((pm:any)=>
{
pm.values.map((val:any)=>{
    persoMenuRaw.push({name : pm.name, values : [
    {value : val.value, checked : false }
  ]});
})
setPersoMenu(persoMenuRaw);
})  }

  function handleChangePersoMenu(pers:any, value:any){
    if(persoMenu){
    const i = persoMenu?.findIndex((item:any)=> item.name==pers);
    const j = persoMenu[i].values.findIndex((item:any)=> item.name==pers);
    persoMenu[i].values[0].checked=! persoMenu[i].values[0].checked;
    setPersoMenu(persoMenu);
    if( persoMenu[i].values[0].checked==true){
      setcheckboxBackColor('#ff5050')
      setcheckboxBorderColor('transparent')
    }else{
      setcheckboxBackColor('transparent');
      setcheckboxBorderColor('grey')
    }
}
  }
      useEffect(() => {
        fetchMenu();
      }, []);
  
      function addFormulaChoice(cattitle: any, menutitle:any,menuprice:any,menuid:any){
        console.log(menuid)
      console.log("add " + menutitle)
      console.log("add " + cattitle)
      if(!formulaChoiced){
      let formulaChoicedRaw=[]
      formulaChoicedRaw.push({
        cattitle : cattitle,
        sumtot : menuprice || 0,
        numChoiced : 1,
        menus:[{
          title : menutitle,
          menuid :menuid,
          tar:menuprice ||0, 
          quantity : 1
        }],
      });
      setFormulaChoiced(formulaChoicedRaw)
       }else{
         // existe deja 
       }
       console.log(formulaChoiced)
      }
      
      function removeFormulaChoice(cattitle: any, menutitle:any){
        console.log("remove " + menu?.title)

      }
      async function addToBasket() { 

        let menuRaw = {
          id : menu?.id,
          name : menu?.title,
          description :menu?.description, 
          amount : menu?.price,
          currency: 'eur',
          quantity: 2,
          persoData : persoMenu||[],
          formulaChoiced: formulaChoiced ||[]
        };

        console.log(menuRaw) 
      Alert.alert('',"Un plat ajouté. Vous pouvez en rajouter un autre ou revenir sur le menu et votre panier. ")
        store.dispatch(add(menuRaw))
       };

  return (
    <View style={styles.container}> 
<ScrollView style={styles.scrollview}>
{menu && menu.imageUrl &&
     <Image style={styles.image}
          source={{uri: menu.imageUrl}}
          />
         }
          {menu &&
      <Text style={styles.title}>{menu.title}  </Text>
            }
        {menu &&
              <Text style={styles.text}>{menu.description}    </Text>
        }

     <View>
      {menu && menu.formulaChoiced !== null &&
             menu.formulaChoiced !== undefined &&
             menu.formulaChoiced.map((fccat:any, index4:any) => 
             <View key={fccat.cattitle+index4}>

       <ListItem key={fccat.cattitle+index4} bottomDivider  
    containerStyle={{backgroundColor:"#ff5050", borderColor:"#ff5050"}}>
    <ListItem.Content>
      <ListItem.Title style = {styles.textCat}> {fccat.cattitle} </ListItem.Title>
    </ListItem.Content>
  </ListItem>  
       {fccat !== null &&
            fccat !== undefined &&
            fccat.menus.map((menu:any, index4:any) => 
            <ListItem key={menu.title + index4 } 
            containerStyle={{ backgroundColor: backgroundColor }}
            bottomDivider> 
            
      <ListItem.Content>
        <ListItem.Title style={{marginTop:9, color: textColor, fontSize: 16, fontFamily:'geometria-regular'}}>  
{menu.title} </ListItem.Title>

{menu.tar >0 && 
        <ListItem.Subtitle  style={{marginTop:2, color: textColor, fontSize: 14, fontFamily:'geometria-regular'}}>
        {menu.tar} € </ListItem.Subtitle>
      }

      </ListItem.Content>
      <Ionicons name="remove-circle" style={styles.searchIcon}  onPress={() =>  removeFormulaChoice(fccat.cattitle,menu.title)} />
        <ListItem.Subtitle style={{marginTop:2, color: textColor, fontSize: 18, fontFamily:'geometria-regular'}} >{menu.quantity}</ListItem.Subtitle>
      <Ionicons name="add-circle" style={styles.searchIcon}  onPress={() =>  addFormulaChoice(fccat.cattitle, menu.title,menu.tar,menu.menuid)} />
    </ListItem>
            )}
     </View>
              )}
</View>
          
{persoMenu && persoMenu.map((pers:any, index4:any) => 
    <View key={pers.name+ index4}>

    <ListItem key={pers.name} bottomDivider  
    containerStyle={{backgroundColor:"#ff5050", borderColor:"#ff5050"}}>
    <ListItem.Content>
      <ListItem.Title style = {styles.textCat}> {pers.name} </ListItem.Title>
    </ListItem.Content>
  </ListItem>    
            {pers.values && pers.values.map((value:any, index8:any) =>               
            <View key={value.value  + "view"} >             
          <TouchableOpacity onPress={() => handleChangePersoMenu(pers.name, value.value) } 
            style={{
              elevation: 8,
              marginTop :10,
              marginHorizontal :9,
              marginBottom :10,
              borderWidth:1,
              backgroundColor:checkboxBackColor,
              borderColor:checkboxBorderColor,
              borderRadius: 10,
              padding: 5,
        
            }}>
    <Text style={styles.appButtonTextCheckbox}>{value.value}</Text>
  </TouchableOpacity>
            
    </View>
)}           
  
</View>
             )}        

  </ScrollView>
  <TouchableOpacity onPress={() => addToBasket() } 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>🧺 Ajouter au panier</Text>
  </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image:{
    height:400,
    resizeMode:'cover'
  },
 
  appButtonTextCheckbox:{
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "geometria-regular",
   },
  appButtonContainer:{
    elevation: 8,
    marginTop :30,
    marginHorizontal :20,
    marginBottom :10,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1
  },
  scrollview:{
height:'100%'
  },
  appButtonText:{
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "geometria-bold",
    textTransform: "uppercase"
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
    fontFamily: "geometria-regular",
    fontSize: 16,
    padding: 20
  },
  textCat: {
    flex:1,
    fontFamily: "geometria-bold",
    fontSize: 16,
    color:'white'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },  
});


export default DishScreen;