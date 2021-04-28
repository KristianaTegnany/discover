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
import { Divider } from 'react-native-elements/dist/divider/Divider';

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}

export const termsScreen = ({ route, navigation}: Props) => {

  const products = useSelector((state: ProductItem[]) => state);
  const [myintcust, setMyintcust] = useState({
    id : '',
    overviewpicUrl: ' ',
    corporation:'',
    EngagModeOnSite:false,
    EngagModeTakeAway:false,
    EngagModeDelivery:false,
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
    deliverynoonblock:'',
    contactphone:'',
    noNightTakeAway:false,
    noNightDelivery:false
  });

  async function fetchIntcust() {


  }


      useEffect(() => {
        var Intcust = Parse.Object.extend("Intcust");
        let myintcustRaw = new Intcust;
        myintcustRaw.id = route.params.restoId;
        myintcustRaw={
          id: myintcustRaw.id || '',
          overviewpicUrl: myintcustRaw.attributes.overviewpic._url || '',
          corporation: myintcustRaw.attributes.corporation || '',
          EngagModeTakeAway:  myintcustRaw.attributes.EngagModeTakeAway || false,
          EngagModeDelivery:  myintcustRaw.attributes.EngagModeDelivery || false,
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
         contactphone : myintcustRaw.attributes.contactphone || '',
         noNightTakeAway:  myintcustRaw.attributes.noNightTakeAway || false,
         noNightDelivery:  myintcustRaw.attributes.noNightDelivery || false,
        }
        setMyintcust(myintcustRaw);
      }, []);

    

  return (
    <View style={styles.container}> 
    <ScrollView>     
    <Text style={styles.title}>Nous nous engageons à vous faire vivre une expérience délicieuse</Text>
     <Text style={styles.text}>Pour se faire, merci de respecter les règles suivantes, correspondant aux contraintes de production du restaurant : </Text>
     <Text style={styles.text}>Fin de commande le midi :{myintcust.takeawaynightblock} </Text>
     <Text style={styles.text}>Fin de commande le soir : </Text>
     <Text style={styles.text}>Délai entre la commande et la récupération / livraison : </Text>
    
     <Text style={styles.text}>Les créneaux de livraison s'entendent A partir de l'heure sélectionnée, jusqu'au début du créneau suivant. </Text>
     <Text style={styles.text}>Les livraisons sont assurées par :  </Text>
     <Text style={styles.text}>Nos prestataires mettent tout en oeuvre pour tenir le délai du créneau.  </Text>
     <Text style={styles.text}>Celui-ci n'est pas garanti de facto dans les cas suivants : </Text>
     <Text style={styles.text}>Le restaurant ne se trouve pas dans la commune de livraison. </Text>
     <Text style={styles.text}>Le restaurant ou le lieu de livraison se situe dans la commune du Lamentin (Martinique). </Text>
     <Text style={styles.text}>La livraison est programmée pour le vendredi entre 12h et 14h. </Text>
     <Text style={styles.text}>En cas de retard de livraison, ne relevant pas de ces cas, il est à la discrétion du restaurant et/ou du livreur de vous proposer une compensation. Le contenu de cette compensation est à sa libre définition. </Text>
     <Text style={styles.text}>Pour compléter une commande, merci d'effectuer une nouvelle commande et d'indiquer une demande de regroupement en note de livraison. Les frais de livraison de la deuxième commande vous seront remboursés à postériori. </Text>

     <Text style={styles.text}>Merci de respecter les gestes barrières et les consignes sanitaires, notamment de porter un masque et de mettre du gel avant et après avoir récupéré votre commande A emporter ou En livraison. </Text>

     </ScrollView>

    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
 //   padding:30,
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
    fontSize: 25,
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
    fontSize: 20,
    paddingHorizontal:20,

    top:0,
    fontFamily: "geometria-regular",

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  
});

export default termsScreen;