import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { Alert, Image, Route, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { add, store } from '../store';
import { useEffect } from 'react';
import { useState } from 'react';

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface IMenu {id: string; imageUrl:any; title : string; description : string; formulaChoiced : [], persoMenu:[], price : number}

export const DishScreen = ({ route, navigation}: Props) => {
  const [menu, setMenu] = useState <IMenu>();

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
  quantity : 1

 }
       setMenu(menuRaw);
  }

      useEffect(() => {
        fetchMenu();
      }, []);
  
      async function addToBasket() {  
      Alert.alert('',"Un plat ajouté. Vous pouvez en rajouter un autre ou revenir sur le menu et votre panier. ")
        store.dispatch(add(menu))
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
             <View>
       <Text style = {styles.text} key={fccat.cattitle+index4}> {fccat.cattitle} </Text> 
       {fccat !== null &&
            fccat !== undefined &&
            fccat.menus.map((menus:any, index4:any) => 
            <CheckBox key={fccat.cattitle+menus + index4}
             title={menus.title}
             //checked=
           />
            )}

     </View>
          
            
              )}
</View>
{menu && menu.persoMenu && menu.persoMenu.length>-0 &&
<View>
      <Text style={styles.text}>Personnalisez votre choix    </Text>
      </View>
      }

      {menu && menu.persoMenu  &&
             menu.persoMenu !== undefined &&
             menu.persoMenu.map((pers:any, index4:any) => 
             <CheckBox key={pers + index4}
             title={pers.name}
             //checked=
           />
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
    height:'100%',
maxHeight:'90%'
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
    top:0,
    padding: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },  
});


export default DishScreen;