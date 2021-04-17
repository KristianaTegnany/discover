import * as React from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
var Parse = require("parse/react-native");
import GuideComponent from "../components/GuideComponent";
import { FlatList, StyleSheet } from 'react-native';
import _ from 'lodash';
import { Navigation } from 'react-native-navigation';
import { Text, View } from '../components/Themed';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type props = { value: string , navigation:any };
type state = { hasLocationPermissions: boolean, latitude: number , longitude: number,guidesList: any };
export default class GuidesScreen  extends React.Component<props, state>   {
  guidesListCast :any[] = [];
  constructor(props:any) {
    super(props)
    this.state = {     
      hasLocationPermissions: false,
      latitude: 0,
      longitude: 0,
      guidesList :this.guidesListCast
        };
      }


  
  async componentDidMount() {

  //  this.getLocationAsync();
    this.getGuides();

  }

  async getGuides () {
    await Parse.Cloud.run("getGuides")
    .then((response: any) => {
      
        this.setState({
          guidesList: response,
        });

    })
    .catch((error: any)=>console.log(error))

  }

  async getLocationAsync () {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        hasLocationPermissions: true,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      alert('Location permission not granted');
    }
  };

  render() {
  //  const colors =useThemeColor({ light: 'lightColors', dark: 'darkColors' }, 'text');

  return (
    
    <View style={styles.container} >
     
   
    <View style={styles.container2} >

      <FlatList
            style={styles.FlatList}
            data={ this.state.guidesList}  
            renderItem={({ item }) =>   
            <TouchableWithoutFeedback 
            onPress={() => {
              this.props.navigation.navigate('GuideScreen',
              { text: 'Hello!',guideId: item.id });          
              }}
              >     
            <GuideComponent
            imgUrl={item.attributes.FrontPic._url }
            onPress={() => 
              Navigation.push('Guide',{
                component: {
                  name: 'Guide', // Push the screen registered with the 'Settings' key
                }
              })
            }
            corponame={item.attributes.title}
            city={item.attributes.cityvenue}
            StyleK={item.attributes.style}
            style={styles.guideComponent}
          ></GuideComponent></TouchableWithoutFeedback>
          }
          />
           </View>
  </View>
  );
}}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //width: '95%',

   // alignItems: 'left',
    //justifyContent: 'center',
  //  backgroundColor: "rgba(255,255,255,1)"

  },
  container2: {
   // flex: 1,
    width: '100%',

   // alignItems: 'left',
    //justifyContent: 'center',
  //  backgroundColor: "rgba(255,255,255,1)"

  },
  FlatList: {
    width: '100%',
    marginLeft:0,
    paddingLeft:0,
   // justifyContent: "flex-start",
   // justifyContent: 'center',
  //  backgroundColor: "rgba(255,255,255,1)"

  },
  guideComponent: {
    height: 120,
  //  alignSelf: "stretch",
 //   backgroundColor: "rgba(255,255,255,1)"
  },
  searchHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    width: "83%",
    backgroundColor: "#fff",
    marginTop: 0,
    marginRight: 'auto',

    marginLeft: 'auto',
    paddingRight: 20,
    marginBottom:10,
    alignSelf: "baseline"
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1
  },
  searchInput: {
    width: 239,
    height: 40,
    color: '#000',
    marginRight: 1,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "geometria-regular"
  },
  postSection: {
    flex: 1,
 //   marginTop: 23
  },
  postSection_contentContainerStyle: {
    height: 600,
    justifyContent: "flex-start"
  },
  rect: {
    top: 4,
 //   left: 4,
    width: 352,
    height: 107,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    borderRadius: 25
  },
  bigTitle: {
    fontFamily: "geometria-regular",
    height: 60,
    width: "83%",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto'

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
   // padding: 10,
    fontSize: 18,
    height: 44,
  },
 
  
});
