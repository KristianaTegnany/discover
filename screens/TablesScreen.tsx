import * as React from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
var Parse = require("parse/react-native");
import PostComponent from "../components/PostComponent";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import Carousel from 'react-native-snap-carousel'

// @ts-ignore
const sandwitch = require('../assets/images/sandwitch.jpg'),
      poisson   = require('../assets/images/poisson.jpg'),
      panini    = require('../assets/images/sandwitch.jpg'),
      burger    = require('../assets/images/burger.jpg'),
      pizza    = require('../assets/images/pizza.jpg')

type props = { value: string; navigation: any };
type Menu = {
  title: string;
  img: Image;
  selected: boolean;
}
type state = {
  restaurantListOrigin: any;
  hasLocationPermissions: boolean;
  latitude: number;
  longitude: number;
  restaurantList: any;
  searchValue: string;
  filter: boolean;
  selectedMode: string;
  menus: Menu[];
};

export default class TablesScreen extends React.Component<props, state> {
  restaurantListCast: any[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      hasLocationPermissions: false,
      latitude: 0,
      longitude: 0,
      restaurantList: this.restaurantListCast,
      restaurantListOrigin: this.restaurantListCast,
      searchValue: "",
      filter: false,
      selectedMode: "",
      menus: [{title:'Poisson', img: poisson, selected: false},{title:'Burger', img: burger, selected: false},{title:'Pizza', img: pizza, selected: false},{title:'Sandwitch', img: sandwitch, selected: false},{title:'Panini', img: panini, selected: false}]
    };
  }

  async componentDidMount() {
    //  this.getLocationAsync();
    this.getIntcusts();
  }

  async getIntcusts() {
    await Parse.Cloud.run("getIntcustsDiscover")
      .then((response: any) => {
        this.setState({
          restaurantList: response,
          restaurantListOrigin: response,
        });
      })
      .catch((error: any) => console.log(error));
  }

  async onChangeSearch(event: any) {
    //   const {eventCount, target, text} = event.nativeEvent;

    if (
      event == "" ||
      this.state.restaurantList.filter((resto: any) =>
        resto.attributes.corporation.toLowerCase().includes(event.toLowerCase())
      ).length == 0
    ) {
      this.setState({
        restaurantList: this.state.restaurantListOrigin,
      });
    } else {
      this.setState({
        searchValue: event,
      });
      this.setState({
        restaurantList: this.state.restaurantList.filter((resto: any) =>
          resto.attributes.corporation
            .toLowerCase()
            .includes(event.toLowerCase())
        ),
      });
      this.state.restaurantList.filter(
        (resto: any) => resto.corporation == event
      );
    }
  }

  async getLocationAsync() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        hasLocationPermissions: true,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      alert("Location permission not granted");
    }
  }

  FilterButton = (props:any) => {
    const { selectedMode } = this.state
    return (
      <Button onPress={() => this.setState({selectedMode: selectedMode === props.mode? '' : props.mode})} title={props.title} type="outline" buttonStyle={[styles.filterButtonItem, { borderColor: selectedMode === props.mode? 'transparent' : 'black', backgroundColor: selectedMode === props.mode? '#ff5050' : 'white' } ]} titleStyle={{fontSize: 10, fontWeight: 'bold', color: selectedMode === props.mode? 'white' : 'black'}}/>
    )
  }

  _renderItem = (props:any) => {
    return (
      <TouchableOpacity onPress={() => {
        const menus = this.state.menus
        let menu = menus.filter(menu => menu.title === props.item.title && menu.img === props.item.img)[0]
        menu.selected = !menu.selected
        menus[menus.indexOf(menu)]= menu
        this.setState({menus: Object.assign([], menus)})
      }}>
        <View style={{justifyContent:'center'}}>
          <Image source={props.item.img} resizeMode={'cover'} style={{borderRadius: 20, alignSelf:'center', width: 80, height: 80}}/>
          <Text style={{textAlign:'center', color: props.item.selected? '#ff5050' : 'black'}}>{ props.item.title }</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    //  const { search } = this.state.searchValue;

    return (
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <Ionicons name="search" style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher un restaurant"
            style={styles.searchInput}
            defaultValue={this.state.searchValue}
            onChangeText={(value) => this.onChangeSearch(value)}

            //   onChangeText={this.filterResultsSearch}
          ></TextInput>
        </View>
        <View style={{alignSelf:'center', marginBottom: 20, flexDirection:'row', width: '70%', justifyContent:'space-around'}}>
          <this.FilterButton title='Réservation' mode='OnSite'/>
          <this.FilterButton title='A emporter' mode='TakeAway'/>
          <this.FilterButton title='Livraison' mode='Delivery'/>
        </View>
        <View style={{height: 100}}>
          <Carousel
            data={this.state.menus}
            renderItem={this._renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={100}
            inactiveSlideScale={1}
            loop
            autoplay
          />
        </View>
        <View style={styles.container2}>
          {!this.state.restaurantList ||
            (this.state.restaurantList.length == 0 && (
              <View style={styles.wrapindicator}>
                <ActivityIndicator size="large" color="#F50F50" />
              </View>
            ))}
          <FlatList
            style={styles.FlatList}
            data={this.state.restaurantList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate("RestoScreen", {
                    text: "Hello!",
                    restoId: item.id,
                  });
                }}
              >
                {item.attributes.frontpic && (
                  <PostComponent
                    imgUrl={item.attributes.frontpic._url}
                    corponame={item.attributes.corporation}
                    city={item.attributes.cityvenue}
                    StyleK={item.attributes.style}
                    style={styles.postComponent}
                  ></PostComponent>
                )}
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",

    // alignItems: 'left',
    //justifyContent: 'center',
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  container2: {
    flex: 1
    //marginTop:40,
    // alignItems: 'left',
    //justifyContent: 'center',
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  wrapindicator: {
    alignItems: "center",
    height: "70%",
    justifyContent: "center",
  },
  filterButtonItem: {
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10
  },
  FlatList: {
    width: "100%",
    marginLeft: 20,
    marginRight: 20,

    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  postComponent: {
    height: 120,
    width: "100%",
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
    marginRight: "auto",
    backgroundColor: "#f4f4f4",
    color: "black",
    marginLeft: "auto",
    paddingRight: 20,
    marginBottom: 10,
    alignSelf: "baseline",
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1,
  },
  searchFilterIcon: {
    width: 30,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  searchInput: {
    width: 239,
    height: 40,
    color: "#000",
    marginRight: 1,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "geometria-regular",
  },
  postSection: {
    flex: 1,
    marginTop: 23,
  },
  postSection_contentContainerStyle: {
    height: 600,
    justifyContent: "flex-start",
  },
  rect: {
    top: 4,
    //   left: 4,
    width: 352,
    height: 107,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    borderRadius: 25,
  },
  bigTitle: {
    fontFamily: "geometria-regular",
    height: 60,
    width: "83%",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  item: {
    // padding: 10,
    fontSize: 18,
    height: 44,
  },
});
