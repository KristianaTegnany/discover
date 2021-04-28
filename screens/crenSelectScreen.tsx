import { NavigationState } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import { Route, ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { View } from '../components/Themed';
import { ListItem, ThemeConsumer, useTheme, withTheme} from 'react-native-elements'
import moment from 'moment';
import 'moment/locale/fr';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';


interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  theme: ThemeProps;
}
type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

interface IDays {
  day: string;
  fday:{}
}
export const crenSelectScreen = ({ route, navigation, theme }: Props) => {
  const [daystobook, setDaystobook] = useState<IDays[]>();
  const [blockEvents, setBlockEvents] = useState([]);

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
  useEffect(() => {   
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = route.params.restoId;
   var businessHours = [];

    if (route.params.bookingType=="TakeAway"){
      businessHours = intcustRaw.get("businessHoursTaway");

  }else if (route.params.bookingType=="Delivery"){
    businessHours = intcustRaw.get("businessHoursDelivery");

  }else if(route.params.bookingType=="OnSite"){
    businessHours = intcustRaw.get("businesshours");
  }
    let day = moment();
    let days=[];
    var i;
    for (i = 0; i < 30; i++) {
     
     let  index1 =  businessHours.findIndex((bh: any)=> 
       bh.daysOfWeek== day.isoWeekday() )
     if( index1>=0){   // tester si inclus dans les business hours et pas dans les blocks events
      days.push({
        "day": moment(day).format("dddd DD MMM"),
        "fday": day.format()
       } );
    }
      day.add(1, "day");
  }
  setDaystobook(days);
 },[]);

  return (
    <View style={styles.container}>
            <ScrollView>

              
            { daystobook !== null &&
               daystobook !== undefined && 
             daystobook.map((day,index) => 
        
              <ListItem key={index} 
              containerStyle={{ backgroundColor: backgroundColor }}
              bottomDivider onPress={() => {
                navigation.navigate('hourSelectScreen',
                { restoId: route.params.restoId , 
                  bookingType:route.params.bookingType, 
                  day: moment(day.fday).format() });          
                }} >
         
        <ListItem.Content >

          <ListItem.Title style={{marginTop:9, color: textColor, fontSize: 20, fontFamily:'geometria-regular'}}>{day.day} </ListItem.Title>
          <ListItem.Subtitle>
          </ListItem.Subtitle>

        </ListItem.Content>
        <ListItem.Chevron 
         />
      </ListItem>
             
           
              )}
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
  FlatList: {
    width: '100%',
    marginLeft:0,
    paddingLeft:0,
   // justifyContent: "flex-start",
   // justifyContent: 'center',
  //  backgroundColor: "rgba(255,255,255,1)"

  },
 

  title: {
    fontSize: 34,
    padding:30,
    fontFamily: "geometria-bold",
    fontWeight: 'bold',
  },
  text: {
    fontSize: 22,
    padding: 4,
    fontFamily: "geometria-regular",

  },

  
});

export default crenSelectScreen;