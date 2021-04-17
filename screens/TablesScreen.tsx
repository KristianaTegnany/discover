import * as React from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
var Parse = require("parse/react-native");
import PostComponent from "../components/PostComponent";
import { FlatList, StyleSheet,StatusBar, TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { View } from '../components/Themed';

type props = { value: string, navigation:any };
type state = { hasLocationPermissions: boolean, latitude: number , longitude: number,restaurantList: any, searchValue: string };
export default class TablesScreen  extends React.Component<props, state>   {

  restaurantListCast :any[] = [];
  constructor(props:any) {
    super(props)
    this.state = {     
      hasLocationPermissions: false,
      latitude: 0,
      longitude: 0,
      restaurantList :this.restaurantListCast,
      searchValue:""
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

  async filterResultsSearch(searchtext:any){
    console.log("ddd")
  
  }

  render() {
    const { search } = this.state.searchValue;

  return (
    
    <View style={styles.container} >
      
     {/* <View style={styles.searchHeader} >
      <Ionicons name="search" style={styles.searchIcon} />
        <TextInput
          placeholder="Rechercher un restaurant"
          style={styles.searchInput}
        // value={search}
         onChangeText={this.filterResultsSearch}
        ></TextInput>
    </View>  */}
    <View style={styles.container2} >
   
      <FlatList
            style={styles.FlatList}
            data={ this.state.restaurantList}  
            
            renderItem={({ item }) => 
            <TouchableWithoutFeedback 
            onPress={() => {
              this.props.navigation.navigate('RestoScreen',
              { text: 'Hello!',restoId: item.id });          
              }}
              >    
              {item.attributes.frontpic && 
            <PostComponent
            imgUrl={item.attributes.frontpic._url }
            
            corponame={item.attributes.corporation}
            city={item.attributes.cityvenue}
            StyleK={item.attributes.style}
            style={styles.postComponent}
          ></PostComponent>
}

              </TouchableWithoutFeedback>

          }
          />
           </View>
  </View>
  );
}}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: '100%',

   // alignItems: 'left',
    //justifyContent: 'center',
 //   backgroundColor: "rgba(255,255,255,1)"

  },
  container2: {
   // flex: 1,
    width: '100%',
marginTop:40,
   // alignItems: 'left',
    //justifyContent: 'center',
 //   backgroundColor: "rgba(255,255,255,1)"

  },
  FlatList: {
    width: '100%',
    marginLeft:30,
    marginRight:30,

   // justifyContent: "flex-start",
   // justifyContent: 'center',
  //  backgroundColor: "rgba(255,255,255,1)"

  },
  postComponent: {
    height: 120,
    width:'100%',
  //  alignSelf: "stretch",
 //  backgroundColor: "rgba(255,255,255,1)"
  },
  searchHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    width: "83%",
    marginTop: 60,
    marginRight: 'auto',
    backgroundColor: "#f4f4f4",
    color:'black',
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
    fontFamily: "geometria-regular",

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
