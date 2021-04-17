import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import {Alert, Button, Image, Route, StyleSheet, ViewComponent } from 'react-native';
import { CheckBox, ListItem } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import {AppContext} from '../components/GlobalContext';
import { add, store } from '../store';

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}
type state = { restaurant: any , persoMenu:any, formulaChoice:any;line_items:any}


export default class DishScreen  extends React.Component<Props,state>   {
  restaurantCast :any[] = [];
  persoMenuCast :any[] = [];
  formulaChoiceCast: any[] = [];
  line_itemsCast: any[] = [];
  static contextType = AppContext;

  state = {     
    restaurant :this.restaurantCast,
    persoMenu : this.persoMenuCast, 
    formulaChoice : this.formulaChoiceCast,
    line_items : this.line_itemsCast,

      };
  constructor(Props:any) {
    super(Props)
      }

  async componentDidMount() {  
    console.log(DishScreen.contextType);

  }

  
  addToBasket = (item:any, qty:any) => {
      //Alert.alert(
       // 'Ajouté au panier',
       // `${qty} ${item.name} was added to the basket.`,
     // );
     console.log("thiere in add to basket")
     this.context.addToCart(item, qty);
    
  };
  
      render() {
        var Menu = Parse.Object.extend("Menu");
      let menu  = new Menu;
      menu.id = this.props.route.params.menuid;

  return (
    <View style={styles.container}> 
    {menu.attributes.image ?
     <Image style={styles.image}
          source={{uri: menu.attributes.image._url}}
          />
          :
          null}
          

      <Text style={styles.title}>{menu.attributes.title}  </Text>
      <ScrollView style={styles.scrollview}>

      <Text style={styles.text}>{menu.attributes.description}    </Text>
     <View>
      {menu.attributes.formulaChoice !== null &&
             menu.attributes.formulaChoice !== undefined &&
             menu.attributes.formulaChoice.map((fccat:any, index4:any) => 
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
{!(menu.attributes.persoMenu !== null ||  menu.attributes.persoMenu !== undefined ) ?
<View>
      <Text style={styles.text}>Personnalisez votre choix    </Text>
      </View>
      :
      null}

      {menu.attributes.persoMenu !== null &&
             menu.attributes.persoMenu !== undefined &&
             menu.attributes.persoMenu.map((pers:any, index4:any) => 
             <CheckBox key={pers + index4}
             title={pers.name}
             //checked=
           />
              )}
      

  <TouchableOpacity onPress={() => store.dispatch(add(menu))} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Ajouter au panier</Text>
  </TouchableOpacity>

  </ScrollView>
    </View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image:{
height:'20%'
  },
  appButtonContainer:{
    elevation: 8,
    marginTop :30,

    marginBottom :10,
    backgroundColor: "#009688",
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
