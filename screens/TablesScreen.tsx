import * as React from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
var Parse = require("parse/react-native");
import PostComponent from "../components/PostComponent";
import { FlatList, StyleSheet,StatusBar, Text,TextInput, View, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Navigation } from 'react-native-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


type props = { value: string, navigation:any };
type state = { hasLocationPermissions: boolean, latitude: number , longitude: number,restaurantList: any };
export default class TablesScreen  extends React.Component<props, state>   {

  restaurantListCast :any[] = [];
  constructor(props:any) {
    super(props)
    this.state = {     
      hasLocationPermissions: false,
      latitude: 0,
      longitude: 0,
      restaurantList :this.restaurantListCast
        };
      }


  
  async componentDidMount() {

  //  this.getLocationAsync();
    this.getIntcusts();

  }

  async getIntcusts () {
    await Parse.Cloud.run("getIntcustsDiscover")
    .then((response: any) => {
      
        this.setState({
          restaurantList: response,
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
        <Text style={styles.bigTitle} 
       >
          Trouvez du bonheur autour de vous à mettre dans votre assiette
        </Text>
      <View style={styles.searchHeader}>
      <Ionicons name="search" style={styles.searchIcon} />
        <TextInput
          placeholder="Rechercher"
          style={styles.searchInput}
        ></TextInput>
    </View>
    <View style={styles.container2} >

      <FlatList
            style={styles.FlatList}
            data={ this.state.restaurantList}  
            
            renderItem={({ item }) => 
            <TouchableWithoutFeedback onPress={() => {
              this.props.navigation.navigate('RestoScreen');          
              }
            }>    
            <PostComponent
            imgUrl={item.attributes.overviewpic._url }
            
            corponame={item.attributes.corporation}
            city={item.attributes.cityvenue}
            StyleK={item.attributes.style}
            style={styles.postComponent}
          ></PostComponent>
              </TouchableWithoutFeedback>

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
  postComponent: {
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
    fontFamily: "work-sans-700"
  },
  postSection: {
    flex: 1,
    marginTop: 23
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
    fontFamily: "work-sans-700",
    height: 110,
    width: "83%",
    fontSize: 22,
    marginTop: 60,
    marginBottom: 0,
  //  color:this.colors.text,
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
