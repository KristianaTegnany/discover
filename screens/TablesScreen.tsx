import * as React from "react";

var Parse = require("parse/react-native");
import PostComponent from "../components/PostComponent";
import {
  FlatList,
  Animated,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { View } from "../components/Themed";
import { Button } from "react-native-elements";
import Carousel from "react-native-snap-carousel";
import Modal from "react-native-modal";
import RadioButton from "../components/Radio";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
const asia = require("../assets/images/asia.jpeg"),
  beach = require("../assets/images/beach.jpeg"),
  vegan = require("../assets/images/vegan.jpeg"),
  burger = require("../assets/images/burger.jpeg"),
  salade = require("../assets/images/salade.jpeg"),
  cuisinecreole = require("../assets/images/cuisinecreole.jpeg"),
  fish = require("../assets/images/fish.jpeg"),
  pouce = require("../assets/images/pouce.jpeg"),
  fastgood = require("../assets/images/fastgood.jpeg"),
  woman = require("../assets/images/woman.jpeg"),
  authentic = require("../assets/images/authentic.jpeg"),
  crea = require("../assets/images/crea.jpeg");

type props = { value: string; navigation: any };
type Menu = {
  title: string;
  img: Image;
  key: string;
  selected: boolean;
};
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
  isPlaceModal: boolean;
  martinique: boolean;
  guadelope: boolean;
  fdfrance: boolean;
  schoelcher: boolean;
  mahault: boolean;
  showCarousel: boolean;
  scale: any;
  opacity: any;
  loading: boolean;
  countries: any;
  parent: any;
  child1: any;
  child2: any;
  isFiltre: boolean;
};

export default class TablesScreen extends React.PureComponent<props, state> {
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
      isPlaceModal: false,
      martinique: true,
      fdfrance: true,
      schoelcher: true,
      guadelope: false,
      mahault: false,
      showCarousel: true,
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
      menus: [
        { title: "Asiatique", key: "asia", img: asia, selected: false },
        { title: "Bord de mer", key: "beach", img: beach, selected: false },
        { title: "Vegan", key: "vegan", img: vegan, selected: false },
        { title: "Burger", key: "burger", img: burger, selected: false },
        {
          title: "Creole",
          key: "cuisinecreole",
          img: cuisinecreole,
          selected: false,
        },
        { title: "Salade", key: "salade", img: salade, selected: false },
        { title: "Poisson", key: "fish", img: fish, selected: false },
        { title: "Sur le pouce", key: "pouce", img: pouce, selected: false },
        { title: "Fastgood", key: "fastgood", img: fastgood, selected: false },
        { title: "Cheffe", key: "woman", img: woman, selected: false },
        {
          title: "Authentique",
          key: "authentic",
          img: authentic,
          selected: false,
        },
        { title: "Excellence", key: "crea", img: crea, selected: false },
      ],
      countries: [],
      parent: null,
      child1: null,
      child2: null,
      isFiltre: true,
      loading: true,
    };
  }

  async componentDidMount() {
    this.getIntcusts();
  }

  async getIntcusts() {
    this.setState({ loading: true });
    await Parse.Cloud.run("getIntcustsDiscover")
      .then((response: any) => {
        const activeRestos = response.filter((resto:any) => resto.attributes.EngagModeOnSite || resto.attributes.EngagModeDelivery || resto.attributes.EngagModeTakeAway)
        , nonactiveRestos = response.filter((resto:any) => !(resto.attributes.EngagModeOnSite || resto.attributes.EngagModeDelivery || resto.attributes.EngagModeTakeAway))
        
        this.setState({
          restaurantList: [...activeRestos, ...nonactiveRestos],
          restaurantListOrigin: [...activeRestos, ...nonactiveRestos],
        });

        let countries: any = [];
        response.forEach((intcust: any) => {
          const country = {
              name: intcust.attributes.country
                .trim()
                .replace(/^\w/, (c: any) => c.toUpperCase()),
              cities: [],
              checked: false,
            },
            city = {
              name: intcust.attributes.cityvenue
                .trim()
                .replace(/^\w/, (c: any) => c.toUpperCase()),
              checked: false,
            };

          if (country) {
            let index = countries.findIndex(
              (item: any) => item.name === country.name
            );
            if (index === -1) countries.push(country);
            index = countries.findIndex(
              (item: any) => item.name === country.name
            );
            const indexCity = countries[index].cities.findIndex(
              (item: any) => item.name === city.name
            );
            if (city && indexCity === -1) countries[index].cities.push(city);
          }
        });
        this.setState({ countries, loading: false });
      })
      .catch((error: any) => console.log(error));
  }

  strToNormalize = (str:any) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/'/g, '').replace(/"/g, '')
  }

  filtre = () => {
    this.setState({ loading: true });
    const {
      searchValue,
      selectedMode,
      menus,
      restaurantListOrigin,
    } = this.state;
    const selectedPlace = this.getSelectedPlace().toLowerCase();
    this.setState({
      restaurantList:
        restaurantListOrigin.length === 0
          ? []
          : restaurantListOrigin.filter((resto: any) => {
              const byValue = searchValue !== "",
                byMode = selectedMode !== "",
                byCateg = menus
                  ? menus.filter((menu) => menu.selected).length === 1
                  : false,
                place = selectedPlace !== "toutes les régions";
              const condByValue = searchValue && resto.attributes.corporation && this.strToNormalize(resto.attributes.corporation)
                  .toLowerCase()
                  .includes(this.strToNormalize(searchValue).toLowerCase()),
                condByMode = resto.attributes[`EngagMode${selectedMode}`],
                condByCateg =
                  byCateg &&
                  resto.attributes.qualifDiscover &&
                  resto.attributes.qualifDiscover.length > 0
                    ? resto.attributes.qualifDiscover[0][
                        menus.filter((menu) => menu.selected)[0].key
                      ]
                    : false,
                condByPlace = place
                  ? resto.attributes.country.toLowerCase() === selectedPlace ||
                    resto.attributes.cityvenue.toLowerCase() === selectedPlace
                  : false;

              let result = true;
              if (byValue && byMode && byCateg)
                result = condByValue && condByMode && condByCateg;
              else if (byValue && byMode) result = condByValue && condByMode;
              else if (byValue && byCateg) result = condByValue && condByCateg;
              else if (byMode && byCateg) result = condByMode && condByCateg;
              else if (byMode) result = condByMode;
              else if (byCateg) result = condByCateg;
              else if (byValue) result = condByValue;
              else result = true;

              return result && (place ? condByPlace : true);
            }),
    });
    this.setState({ loading: false });
  };

  async onChangeSearch(event: any) {
    if (event == "") {
      this.setState({
        restaurantList: this.state.restaurantListOrigin,
      });
    } else {
      this.setState(
        {
          searchValue: event,
        },
        this.filtre
      );
    }
  }

  FilterButton = (props: any) => {
    const { selectedMode } = this.state;
    return (
      <Button
        onPress={() =>
          this.setState(
            { selectedMode: selectedMode === props.mode ? "" : props.mode },
            this.filtre
          )
        }
        title={props.title}
        type="outline"
        buttonStyle={[
          styles.filterButtonItem,
          {
            borderColor: selectedMode === props.mode ? "transparent" : "grey",
            backgroundColor:
              selectedMode === props.mode ? "#ff5050" : "transparent",
          },
        ]}
        titleStyle={{
          fontSize: 13,
          fontFamily: "geometria-bold",
          color: selectedMode === props.mode ? "white" : "grey",
        }}
      />
    );
  };

  _renderItem = (props: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          let menus = this.state.menus;
          menus = menus.map((menu, i) => {
            if (menu.key === props.item.key) {
              return { ...menu, selected: !menu.selected };
            } else return { ...menu, selected: false };
          });
          this.setState({ menus: Object.assign([], menus) }, this.filtre);
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <ImageBackground
            source={props.item.img}
            resizeMode={"cover"}
            imageStyle={{
              borderRadius: 20,
              opacity: props.item.selected ? 1 : 0.4,
            }}
            style={{
              borderWidth: 1,
              justifyContent: "center",
              width: 80,
              height: 80,
              marginBottom: 2,
            }}
          >
            <Text style={{ textAlign: "center", fontFamily: "geometria-bold" }}>
              {props.item.title}
            </Text>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  RadioItem2 = (props: any) => {
    const { checked, title } = props;
    return (
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
        <RadioButton
          onPress={() => {
            let { countries } = this.state;
            countries = countries.map((country: any, i: any) => {
              country.cities = country.cities.map((city: any, j: any) => {
                return {
                  ...city,
                  checked: !checked
                }
              });
              return {
                ...country,
                checked: !checked
              };
            });
            this.setState({ countries }, this.filtre);
          }}
          color="#F50F50"
          status={checked ? "checked" : "unchecked"}
          value={title}
        />
      </View>
    )
  }

  RadioItem = (props: any) => {
    const { index, children, checked, title } = props;
    return (
      <>
        <View
          style={{
            marginTop: index === 0 || !children ? 0 : 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: children ? "bold" : "normal",
              marginBottom: children ? 10 : 5,
            }}
          >
            {title}
          </Text>
          <RadioButton
            onPress={() => {
              let { countries } = this.state;
              let indexCountry = 0;
              countries = countries.map((country: any, i: any) => {
                country.cities = country.cities.map((city: any, j: any) => {
                  if (city.name === title) indexCountry = i;
                  return {
                    ...city,
                    checked: children
                      ? i === index
                        ? true
                        : false
                      : title === city.name,
                  };
                });
                return {
                  ...country,
                  checked: children
                    ? i === index
                      ? true
                      : false
                    : i === indexCountry
                    ? country.cities.filter((city: any) => !city.checked)
                        .length === 0
                    : false,
                };
              });
              this.setState({ countries }, this.filtre);
            }}
            color="#F50F50"
            status={checked ? "checked" : "unchecked"}
            value={title}
          />
        </View>
        {children}
      </>
    );
  };

  getSelectedPlace = () => {
    let place = "Toutes les régions";
    const { countries } = this.state
    if(countries.filter((country:any) => country.checked).length !== countries.length)
      countries.forEach((country: any) => {
        if (country.checked) place = country.name;
        else {
          country.cities.forEach((city: any) => {
            if (city.checked) place = city.name;
          })
        }
      })
    return place
  }

  renderEmpty = () => {
    if (this.state.loading) return null;
    else
      return (
        <View
          style={{
            alignSelf: "center",
            marginTop: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            onPress={() => {
              this.setState({ isFiltre: !this.state.isFiltre });
              if (!this.state.isFiltre) this.filtre();
              else
                this.setState({
                  restaurantList: this.state.restaurantListOrigin,
                });
            }}
            style={{
              textAlign: "center",
              width: "70%",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Pas de résultat trouvé.
          </Text>
          <Text
            onPress={() => {
              this.setState({ isFiltre: !this.state.isFiltre });
              if (!this.state.isFiltre) this.filtre();
              else
                this.setState({
                  restaurantList: this.state.restaurantListOrigin,
                });
            }}
          >
            {" "}
            Touchez ici pour effacer tous les filtres.
          </Text>
        </View>
      );
  };

  render() {
    //  const { search } = this.state.searchValue;
    const { isPlaceModal } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          isVisible={isPlaceModal}
          onSwipeComplete={(e) => this.setState({ isPlaceModal: false })}
          onBackButtonPress={() => this.setState({ isPlaceModal: false })}
          onBackdropPress={() => this.setState({ isPlaceModal: false })}
          style={{ margin: 0 }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              padding: 20,
              right: 0,
              left: 0,
              height: "50%",
            }}
          >
            <ScrollView>
              <View style={{ flex: 1 }}>
                <this.RadioItem2
                  title="Toutes les régions"
                  checked={this.state.countries.filter((country:any) => !country.checked).length === 0}
                />
                {this.state.countries.map((country: any, i: any) => (
                  <this.RadioItem
                    key={i}
                    index={i}
                    title={country.name}
                    checked={country.checked}
                  >
                    {country.cities.map((city: any, j: any) => (
                      <this.RadioItem
                        key={j}
                        index={j}
                        title={city.name}
                        checked={city.checked}
                      />
                    ))}
                  </this.RadioItem>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>

        <View
          style={{
            marginTop: 60,
            alignSelf: "baseline",
           // width: "85%",
           marginLeft:20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginRight: 10, fontSize: 16 }}>
            {this.getSelectedPlace()}
          </Text>
         
           <Ionicons name={"create-outline"} color={this.state.isFiltre? 'grey' : 'grey'} size={20} 
            onPress={() => this.setState({ isPlaceModal: true })}/> 
        </View>

        <View style={styles.searchHeader}>
          <Ionicons name="search" style={styles.searchIcon} />
          <TextInput
            placeholder="Tapez le nom d'un restaurant"
            placeholderTextColor={"grey"}
            style={styles.searchInput}
            defaultValue={this.state.searchValue}
            onChangeText={(value) => this.onChangeSearch(value)}

            //   onChangeText={this.filterResultsSearch}
          ></TextInput>
        </View>
        <View
          style={{
            marginVertical: 20,
            alignSelf: "center",
            flexDirection: "row",
           paddingHorizontal:20,
       //     backgroundColor:"grey",
            width: "100%",
          }}
        >
          <this.FilterButton
            style={{ fontFamily: "geometria-regular", border: "grey",  }}
            title="Réservation"
            mode="OnSite"
          />
          <this.FilterButton title="A emporter" mode="TakeAway" />
          <this.FilterButton title="Livraison" mode="Delivery" />
        </View>
        {this.state.showCarousel && false && (
          <Animated.View
            style={{
              height: 100,
              transform: [{ scale: this.state.scale }],
              opacity: this.state.opacity,
            }}
          >
            <Carousel
              data={this.state.menus}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={100}
              firstItem={3}
              // inactiveSlideScale={1}
            />
          </Animated.View>
        )}
        <View style={styles.container2}>
          {this.state.loading && (
            <View style={styles.wrapindicator}>
              <ActivityIndicator size="large" color="#F50F50" />
            </View>
          )}
          <FlatList
            style={styles.FlatList}
            data={this.state.restaurantList}
            initialNumToRender={this.state.restaurantList.length}
            contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
            ListEmptyComponent={this.renderEmpty}
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
                    country={item.attributes.country}
                    StyleK={item.attributes.style}
                    resaOpen={item.attributes.EngagModeOnSite}
                    deliveryOpen={item.attributes.EngagModeDelivery}
                    takeawayOpen={item.attributes.EngagModeTakeAway}
                  />
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
    flex: 1,
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
    paddingVertical: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontFamily: "geometria-regular",
  },
  FlatList: {
    width: "100%",
    paddingTop:10,
    paddingRight: 20,
    paddingLeft: 20,
    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  searchHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
     width: "87%",
    marginTop: 10,
    marginHorizontal:20,
   // marginRight: "auto",
    backgroundColor: "#f4f4f4",
    color: "black",
   // marginLeft: "auto",
    marginBottom: 0,
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
    //  fontWeight: "bold",
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
