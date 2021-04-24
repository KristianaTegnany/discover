import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {Alert, Button, Image, Route, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import { NavigationScreenProp } from 'react-navigation';
import { useSelector } from 'react-redux';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { ProductItem } from '../global';
import { add, remove,emptyall, store } from '../store';

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}



  export const RestoScreen = ({ route, navigation}: Props) => {
    const [myintcust, setMyintcust] = useState({
      id : '',
      overviewpicUrl: ' ',
      corporation:'',
      EngagModeOnSite:false,
      EngagModeTakeAway:false,
      introwebsite:'',
      style:'',
      adressvenue:'',
      zipvenue:'',
      cityvenue:'',
      onsitenoonblock: '',
      onsitenightblock:'',
      preswebsite:'',
      takeawaynoonblock:'',
      takeawaynightblock:'',
      deliverynightblock :'',
      deliverynoonblock:''

    });

    // horaires 
    // Limites de commande 
    const products = useSelector((state: ProductItem[]) => state);
    const tagsStyles = { p: { fontFamily: 'geometria-regular', fontSize: 18, } };

    async function fetchIntcust (){
      console.log("go")
      var Intcust = Parse.Object.extend("Intcust");
      let myintcustRaw = new Intcust;
      myintcustRaw.id = route.params.restoId;
      myintcustRaw={
        id: myintcustRaw.id || '',
        overviewpicUrl: myintcustRaw.attributes.overviewpic._url || '',
        corporation: myintcustRaw.attributes.corporation || '',
        EngagModeTakeAway:  myintcustRaw.attributes.EngagModeTakeAway || false,
        introwebsite: myintcustRaw.attributes.introwebsite || '',
        EngagModeOnSite : myintcustRaw.attributes.EngagModeOnSite || false,
        style : myintcustRaw.attributes.style || '',
        adressvenue : myintcustRaw.attributes.adressvenue || '',
        zipvenue : myintcustRaw.attributes.zipvenue || '',
        cityvenue : myintcustRaw.attributes.cityvenue || '',
        preswebsite : myintcustRaw.attributes.preswebsite || '',
        onsitenoonblock : myintcustRaw.attributes.onsitenoonblock || '',
        onsitenightblock:myintcustRaw.attributes.onsitenightblock || '',
        takeawaynoonblock:myintcustRaw.attributes.takeawaynoonblock || '',
        takeawaynightblock : myintcustRaw.attributes.takeawaynightblock || '',
        deliverynoonblock:myintcustRaw.attributes.deliverynoonblock || '',
       deliverynightblock : myintcustRaw.attributes.deliverynightblock || '',
      }
      setMyintcust(myintcustRaw);
    }
    useEffect(() => {
      fetchIntcust();
        }, []);

  return (
    <View style={styles.container}> 
   
<ScrollView style={styles.containerScroll}>
{myintcust && myintcust.overviewpicUrl &&
          <Image style={styles.image}
          source={{uri: myintcust.overviewpicUrl}}
          />
    }
      <Text style={styles.title}>{myintcust.corporation}  </Text>
      <Text style={styles.textSub2}>{myintcust.style}    </Text>
      <Text style={styles.textMoli}>{myintcust.adressvenue}  </Text>
      <Text style={styles.textMoli}>{myintcust.zipvenue} {myintcust.cityvenue}</Text>

      <Divider style={{ backgroundColor: 'grey' , marginVertical:20}} />

       <Text style={styles.textItalic}>{myintcust.introwebsite}    </Text>
       {myintcust && myintcust.preswebsite &&
<View style={styles.wrapperHTML}>
       <HTML source={{ html: myintcust.preswebsite }}  tagsStyles={tagsStyles}  />
       </View>
  }
  
       <Divider style={{ backgroundColor: 'grey' , marginVertical:20}} />

       <Text style={styles.textSub}>Réservation sur place    </Text>   
       <Text style={styles.textMoli}>Fin de commande le midi : {myintcust.onsitenoonblock}    </Text>   
       <Text style={styles.textMoli}>Fin de commande le soir : {myintcust.onsitenightblock}    </Text>   

       <Divider style={{ backgroundColor: 'grey' , marginVertical:20}} />

       <Text style={styles.textSub}>Commande à emporter    </Text>   
       <Text style={styles.textMoli}>Fin de commande le midi : {myintcust.takeawaynoonblock}    </Text> 
       <Text style={styles.textMoli}>Fin de commande le midi : {myintcust.takeawaynightblock}    </Text>   
  
       <Divider style={{ backgroundColor: 'grey' , marginVertical:20}} />

<Text style={styles.textSub}>Commande en livraison    </Text>   
<Text style={styles.textMoli}>Fin de commande le midi : {myintcust.deliverynoonblock}    </Text>   
<Text style={styles.textMoli}>Fin de commande le soir : {myintcust.deliverynightblock}    </Text>   

       </ScrollView>
{myintcust && myintcust.EngagModeOnSite &&
      <TouchableOpacity onPress={() => {
        if(products.length>0){
Alert.alert('','Vous avez déjà initié une commande avec un autre restaurant. Si vous continuez votre panier sera remis à zéro.',
[
  {
    text: "Revenir",
    onPress: () => console.log("Cancel Pressed"),
    style: "cancel"
  },
  { text: "Continuer", onPress: () => console.log("OK Pressed") }
])
        }else{
              navigation.navigate('crenSelectScreen',
              { restoId: myintcust.id , bookingType:"OnSite" });          
              }}
            } 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Réservez sur place</Text>
  </TouchableOpacity>
}

{myintcust && myintcust.EngagModeTakeAway &&
  <TouchableOpacity onPress={() => {
    // rajouter avec un autre resto test
    if(products.length>0){
Alert.alert('','Vous avez déjà initié une commande avec un autre restaurant. Si vous continuez votre panier sera remis à zéro.',
[
{
text: "Revenir",
onPress: () => console.log("Cancel Pressed"),
style: "cancel"
},
{ text: "Continuer", onPress: () => {
  store.dispatch(emptyall(products))
  navigation.navigate('crenSelectScreen',
  { restoId: myintcust.id , bookingType:"TakeAway" });  
} }
])
    }else{
          navigation.navigate('crenSelectScreen',
          { restoId: myintcust.id , bookingType:"TakeAway" });          
          }}
        } 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Commandez à emporter</Text>
  </TouchableOpacity>
      }

{myintcust && myintcust.EngagModeTakeAway &&
  <TouchableOpacity onPress={() => {
              navigation.navigate('crenSelectScreen',
              { restoId: myintcust.id , bookingType:"Delivery" });          
              }} 
            style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Commandez en livraison</Text>
  </TouchableOpacity>
      }

    </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  containerScroll:{
    height:'100%'
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
  wrapperHTML:{
marginHorizontal:20,
marginTop:10,
fontFamily:"geometria-regular"
  },
  title: {
  //  flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    padding:20,
    paddingBottom:10,

    fontFamily: "geometria-bold",
    fontWeight: 'bold',
  },
  text: {
    flex:1,
    fontSize: 20,
    top:0,
    fontFamily: "geometria-regular",
    paddingLeft: 20
  },
  textMoli: {
    flex:1,
    fontSize: 18,
    top:0,
    fontFamily: "geometria-regular",
    paddingLeft: 20
  },
  textItalic: {
    flex:1,
    fontSize: 19,
    top:0,
    fontFamily: "geometria-regular",
    paddingLeft: 20,
    fontStyle: 'italic'
  },
  textSub: {
    flex:1,
    fontSize: 20,
    fontFamily: "geometria-bold",
    paddingLeft: 20,
    paddingTop:10,
  },
  textSub2: {
    flex:1,
    fontSize: 20,
    fontFamily: "geometria-bold",
    paddingLeft: 20,
    paddingBottom:10
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  
});
export default RestoScreen;