import { NavigationState } from '@react-navigation/native';
import * as React from 'react';
import {ActivityIndicator, Button, Image, Route, StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from "react-native-render-html";
import { useEffect, useState } from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
interface NavigationParams {  text: string; }
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;
interface Props {navigation: Navigation;route: Route;restaurant: []}
interface IGuide {id: string; imageUrl:any; title:string, content:string}

export const GuideScreen = ({ route, navigation}: Props) => {
 const [guide, setGuide] = useState <IGuide>({
   id:'',
   'imageUrl' :'',
   'title':'',
   'content':'a '
 });
 const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, 'background');
 const textColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
 const tagsStyles = { p: { fontFamily: 'geometria-regular', fontSize: 18, color: textColor } };
 const html =  guide.content || 'a'

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
  var Guide = Parse.Object.extend("Guide");
  let guideRaw = new Guide;
  guideRaw.id = route.params.guideId;
  console.log(guideRaw);
  console.log(guideRaw.id);

  setGuide({
    id: guideRaw.id ||'',
    imageUrl:guideRaw.attributes.FrontPic._url  ||'',
    content:guideRaw.attributes.content  ||' a',
    title:guideRaw.attributes.title  ||'',
  });

}, []);

  return (
    <View style={styles.container}>
    <ScrollView style={styles.wrap}>
    { !guide.imageUrl || guide.imageUrl=='' && 
   <View style = {styles.wrapindicator}>
   <ActivityIndicator size="large" color="#F50F50" />
   </View>
  }
          <Image
            source={{
              uri: guide.imageUrl || 'd' ,
            }}
            style={styles.image}  
            resizeMode="cover"
          ></Image>
      <Text style={styles.title}>{guide.title}  </Text>

<View   style={styles.wrapwebview}
>
<HTML source={{ html: html || ' a' }} 
tagsStyles={tagsStyles}
contentWidth={400} />
     </View>
    </ScrollView></View>
  );
          }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
  },
  wrap:{
    flex: 1,
  },
  appButtonContainer:{
    elevation: 8,
    marginBottom :4,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  wrapwebview:{
    flex:1,
    width:'90%',
   // backgroundColor:"white",
   marginLeft:20,
  },
  webview:{
    flex:1,
    width:'100%',
   fontSize: 18,
    color:'white',
  },
  appButtonText:{
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  title: {
    fontSize: 20,
    marginLeft:20,
    marginTop:20,
    flexWrap:'wrap',
    fontFamily:'geometria-bold',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    padding: 4
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  wrapindicator:{
    alignItems: 'center',
    height:'100%',
  justifyContent: 'center',
   },
  image: {
   flex: 1,
   width:'100%',
   height:300,
  },
});

export default GuideScreen;