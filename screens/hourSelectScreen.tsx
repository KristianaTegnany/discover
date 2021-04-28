import {
  NavigationState
} from '@react-navigation/native';
import React, {
  useEffect,
  useState
} from 'react';
import {
  Route,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {
  NavigationScreenProp
} from 'react-navigation';
var Parse = require("parse/react-native");
import {
  Text,
  View
} from '../components/Themed';
import {
  ListItem,
} from 'react-native-elements'
import moment from 'moment';
import 'moment/locale/fr';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';


interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp < NavigationState, NavigationParams > ;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface IHours {  hour: string;}

export const hourSelectScreen = ({ route, navigation}: Props) => {

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
  const [hourstobook, setHourstobook] = useState < IHours[] > ();
  const [goto, setGoto] = useState('Aaa');

  async function fetchHours() {
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = route.params.restoId;
  
    let params2 = {
      itid: route.params.restoId,
      date: moment(route.params.day).format(),
      bookingType: route.params.bookingType
    };
    const res3 = await Parse.Cloud.run("getIntcustWithAvailableCren", params2);
  
    setHourstobook(res3.crenAvailable);

    if (route.params.bookingType == "TakeAway") {
      setGoto('takeawayScreen');

    } else if (route.params.bookingType == "Delivery") {
      setGoto('deliveryScreen');

    } else if (route.params.bookingType == "OnSite") {
      setGoto('resaScreen');
    }
  }

  useEffect(() => {
    fetchHours();
  }, []);



  return ( 
  
  <View style = {styles.container} > 
  {
      hourstobook !== null &&
      hourstobook !== undefined  && 
      <ScrollView >
     
      { hourstobook && hourstobook.map((hour,index) =>
       
       <ListItem key = {index}
       containerStyle={{ backgroundColor: backgroundColor }}
       bottomDivider onPress = {
         () => {
           navigation.navigate(goto, {
             restoId: route.params.restoId,
             bookingType: route.params.bookingType,
             day: route.params.day,
             hour: hour
           });
         }
       } >
       <ListItem.Content >
       <ListItem.Title style={{marginTop:9, color: textColor, fontSize: 20, fontFamily:'geometria-regular'}}> {hour} </ListItem.Title> 
       </ListItem.Content>        
       <ListItem.Chevron/>
       </ListItem>
        )}



        </ScrollView>
    }

  {
   hourstobook && hourstobook.length == 0 && 
   <View>
      <Text style = {styles.textstrong}>Plus d'horaires disponibles ! 🤷🏽‍♂️</Text>
      <Text style = {styles.text}>Les raisons possibles : </Text>
      <Text style = {styles.text}>➡️ L'heure limite de commande est passée.</Text>
      <Text style = {styles.text}>➡️ Le restaurant nous a informé d'un nombre limite de commande atteint pour ce créneau.</Text>
      <Text style = {styles.text}>➡️ Il est fermé exceptionnellement.</Text>

      <Text style = {styles.text}>Vous pouvez choisir un autre jour ou un autre restaurant en revenant en arrière.</Text>

      </View>
  }

{ !hourstobook && 
   <View style = {styles.wrapindicator}>
   <ActivityIndicator size="large" color="#F50F50" />
   </View>
  }
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    //  flex: 1,
    //  alignItems: 'center',
    justifyContent: 'center',
  },
  textstrong:{
    fontWeight: "bold",
    fontFamily: "geometria-bold",
    paddingVertical:20,
    fontSize:18,
    paddingLeft:4

  },
  wrapindicator:{
   alignItems: 'center',
   height:'100%',
 justifyContent: 'center',
  },
  FlatList: {
    width: '100%',
    marginLeft: 0,
    paddingLeft: 0,
    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"

  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 4,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12

  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"

  },
  title: {
    fontSize: 20,
    padding: 30,
    fontWeight: 'bold',
  },
  text: {
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
    //  alignSelf: "stretch",
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
    // marginBottom: 47,
    // marginTop: -252
  },

});

export default hourSelectScreen;