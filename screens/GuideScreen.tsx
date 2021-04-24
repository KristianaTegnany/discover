import { NavigationState } from '@react-navigation/native';
import { WebView } from 'react-native-webview'
import * as React from 'react';
import {ActivityIndicator, Button, Image, Route, StyleSheet, useWindowDimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");
import { Text, View } from '../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from "react-native-render-html";

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}
type state = { restaurant: any, contentWidth:any };

export default class GuideScreen  extends React.Component<Props,state>   {
  restaurantCast :any[] = [];
 //   contentWidth = useWindowDimensions().width;


  constructor(Props:any) {
    super(Props)
    this.state = {     
      restaurant :this.restaurantCast,
      contentWidth : Number
        };
      }

  async componentDidMount() {
    }

      render() {
        var Guide = Parse.Object.extend("Guide");
      let guide = new Guide;
      guide.id = this.props.route.params.guideId;
  //    this.state.guide.attributes.content 

  return (
    <View style={styles.container}>
    <ScrollView style={styles.wrap}>
   
    { !guide.attributes.FrontPic._url || guide.attributes.FrontPic._url=='' && 
   <View style = {styles.wrapindicator}>
   <ActivityIndicator size="large" color="#F50F50" />
   </View>
  }
          <Image
            source={{
              uri: guide.attributes.FrontPic._url ,
            }}
            style={styles.image}  
            resizeMode="cover"
          
          ></Image>
      <Text style={styles.title}>{guide.attributes.title}  </Text>

<View   style={styles.wrapwebview}
>
<HTML source={{ html: guide.attributes.content }} 
contentWidth={400} />

     </View>


  
    </ScrollView></View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
   // alignItems: 'center',
   // justifyContent: 'center',
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
    backgroundColor:"white",
   // height:100,
   marginLeft:20,

  },
  webview:{
    flex:1,
    width:'100%',
   // height:'100%',
   fontSize: 18,
//backgroundColor:'transparent',
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
   // color:'white'
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
//paddingTop:110,
   // marginBottom: 47,
   // marginTop: -252
  },
  
});
