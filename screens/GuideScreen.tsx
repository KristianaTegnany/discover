import { NavigationState } from '@react-navigation/native';
import { WebView } from 'react-native-webview'
import * as React from 'react';
import {Button, Image, Route, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
var Parse = require("parse/react-native");

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: []
}
type state = { restaurant: any };

export default class GuideScreen  extends React.Component<Props,state>   {
  restaurantCast :any[] = [];


  constructor(Props:any) {
    super(Props)
    this.state = {     
      restaurant :this.restaurantCast
        };
      }

  async componentDidMount() {
    console.log("Start")
    }

      render() {
        var Guide = Parse.Object.extend("Guide");
      let guide = new Guide;
      guide.id = this.props.route.params.guideId;

  return (
    <View style={styles.container}>
       
          <Image
            source={{
              uri: guide.attributes.FrontPic._url ,
            }}
            style={styles.image}  
            resizeMode="cover"
          
          ></Image>
      <Text style={styles.title}>{guide.attributes.title}  </Text>
      <WebView
    source={{ uri: 'https://www.tablebig.com/guide/BhCb5xYcek/ida-restaurant-italien-martinique' }}
/>
     

<WebView
    originWhitelist={['*']}
    source={{ html: guide.attributes.content }}
/>
  

    </View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appButtonContainer:{
    elevation: 8,
    marginBottom :4,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12

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
    padding:30,
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
  image: {
   flex: 1,
   width:400,
paddingTop:110,
   // marginBottom: 47,
   // marginTop: -252
  },
  
});
