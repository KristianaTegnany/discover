import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Route,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
var Parse = require("parse/react-native");
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import { Avatar, ListItem } from "react-native-elements";
import { useSelector } from "react-redux";
import { ProductItem } from "../global";
import { StackNavigationProp } from "@react-navigation/stack";

const TAKEAWAY = "TakeAway",
      DELIVERY = "Delivery";

type StackParamList = {
  orderScreen: {
    restoId: string;
  },
  basketScreen: {
    restoId: string,
    bookingType: string,
    day: string,
    hour: string
  },
  DishScreen: {
    restoId: string,
    bookingType: string,
    day: string,
    hour: string,
    menuid: string
  }
}

type Navigation = StackNavigationProp<StackParamList, 'orderScreen'>;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface ICats {
  id: string;
  title: string;
  order: number;
  numExact: number;
}
interface IMenus {
  id: string;
  price: number;
  imageUrl: string;
  title: string;
  order: number;
  description: string;
  category: string;
  minPricevar?: number;
}

export const orderScreen = ({ route, navigation }: Props) => {
  const bookingType = route.params.bookingType
  const [cats, setCats] = useState<ICats[]>();
  const [menus, setMenus] = useState<IMenus[]>();
  const [totalCashBasket, setTotalCashBasket] = useState(0);
  const [totalQuantityBasket, setTotalQuantityBasket] = useState(0);
  const products = useSelector((state: ProductItem[]) => state);

  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");

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

  function getCountOfMenusOfcat(cattitle: string) {
    if (menus) {
      let count = menus.filter((x: any) => x.category == cattitle).length;
      return count;
    }
  }

  async function fetchCatsAndMenus() {
    var Intcust = Parse.Object.extend("Intcust");
    let intcust = new Intcust();
    intcust.id = route.params.restoId;
    var rawCats = intcust.attributes.subcatIm;
    const sortedCats = rawCats.sort(function (a: any, b: any) {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
    });
    setCats(sortedCats);
    let params = {
      itid: route.params.restoId,
    };
    var rawMenus = await Parse.Cloud.run("getMenusActive", params);

    rawMenus = rawMenus
      .filter((menu: any) =>
        route.params?.bookingType === DELIVERY
          ? menu.attributes?.deliveryOptin
          : menu.attributes?.takeAwayOptin
      )
      .map((menu: any) => ({
        id: menu.id,
        price: menu.attributes.price,
        title: menu.attributes.title,
        category: menu.attributes.category,
        minPricevar: menu.attributes.pricevars?.length > 0 ? menu.attributes.pricevars?.length === 1? 0 : Math.min(...menu.attributes.pricevars.map((pricevar:any) => parseFloat((bookingType === DELIVERY ? pricevar.pricevardelivery : bookingType === TAKEAWAY ? pricevar.pricevartakeaway : pricevar.pricevaronsite) || Number.POSITIVE_INFINITY))) : 0,
        order: menu.attributes.order,
        imageUrl: (menu.attributes.image && menu.attributes.image._url) || "",
      }));

    const sortedMenu = rawMenus.sort(function (a: any, b: any) {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
    });
    setMenus(sortedMenu);
  }

  async function sum(array: any, key: any) {
    return array.reduce((a: any, b: any) => a + (b[key] || 0), 0);
  }

  async function calculusTotalCashBasket() {
    // doit prendre en compte les quantités dans le sum ma gueule ba ouais c mon comportement
    let sumRaw = 0;
    products.map((product) => {
      sumRaw = sumRaw + product.quantity * product.amount;
      if (product.persoData) {
        product.persoData.forEach((pers: any) => {
          pers.values.forEach((value: any) => {
            if (value.price && value.price > 0) {
              sumRaw = sumRaw + value.price * product.quantity;
            }
          });
        });
      }

      if (product.formulaChoiced) {
        product.formulaChoiced.forEach((fc: any) => {
          fc.menus.forEach((menu: any) => {
            if (menu.tar && menu.tar > 0) {
              sumRaw = sumRaw + menu.tar * product.quantity;
            }
          });
        });
      }
    });
    setTotalCashBasket(Number(sumRaw.toFixed(2)));
  }

  async function calculusTotalQuantityBasket() {
    let sumRaw = await sum(products, "quantity");
    setTotalQuantityBasket(sumRaw);
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle:
        route.params?.bookingType === DELIVERY ? "Livraison" : "A emporter",
      headerBackTitle: "Retour",
      headerTitleStyle: {
        fontFamily: "geometria-regular",
        fontWeight: "200"
      },
      headerBackTitleStyle: {
        fontFamily: "geometria-regular",
        fontWeight: "200"
      }
    })
  }, [])

  useEffect(() => {
    calculusTotalCashBasket();
    calculusTotalQuantityBasket();
    fetchCatsAndMenus();
  }, [products]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.bookingType === DELIVERY ? "Livraison" : "A emporter"
    })
  }, [route.params])

  function gotoBasket() {
    if (products && products.length > 0) {
      navigation.navigate("basketScreen", {
        restoId: route.params.restoId,
        bookingType: route.params.bookingType,
        day: route.params.day,
        hour: route.params.hour,
      });
    } else {
      Alert.alert("", "Votre panier est vide 🤷🏽‍♂️");
    }
  }

  return (
    <View style={styles.container}>
      <ListItem
        bottomDivider
        containerStyle={{
          backgroundColor: backgroundColor,
          borderColor: "transparent",
        }}
        onPress={gotoBasket}
      >
        <ListItem.Content>
          <ListItem.Title
            style={{
              marginTop: 9,
              color: textColor,
              fontSize: 18,
              fontFamily: "geometria-bold",
            }}
          >
            Voir le panier{" "}
          </ListItem.Title>
          {totalQuantityBasket > 1 && (
            <ListItem.Subtitle
              style={{
                marginTop: 2,
                color: textColor,
                fontSize: 16,
                fontFamily: "geometria-regular",
              }}
            >
              {totalQuantityBasket} articles - {totalCashBasket} €
            </ListItem.Subtitle>
          )}

          {totalQuantityBasket < 2 && (
            <ListItem.Subtitle
              style={{
                marginTop: 2,
                color: textColor,
                fontSize: 16,
                fontFamily: "geometria-regular",
              }}
            >
              {totalQuantityBasket} article - {totalCashBasket} €
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ flex: 1 }}>
          {!cats ||
            (!menus && (
              <View key="123" style={styles.wrapindicator}>
                <ActivityIndicator size="large" color="#F50F50" />
              </View>
            ))}
          {cats &&
            menus &&
            cats.map((cat) => {
              if (getCountOfMenusOfcat(cat.title) !== 0) {
                return (
                  <View key={cat.title + "view"}>
                    <ListItem
                      key={cat.title}
                      bottomDivider
                      containerStyle={{
                        backgroundColor: "#F4F5F5",
                        borderColor: "grey",
                      }}
                    >
                      <ListItem.Content>
                        <ListItem.Title style={styles.textcattitle}>
                          {cat.title}
                          {cat.numExact}{" "}
                        </ListItem.Title>
                      </ListItem.Content>
                    </ListItem>

                    {menus.map((menu) => {
                      if (menu.category == cat.title) {
                        return (
                          <View key={cat.id + menu.id}>
                            <ListItem
                              key={cat.id + menu.id}
                              bottomDivider
                              containerStyle={{
                                backgroundColor: backgroundColor,
                              }}
                              onPress={() => {
                                navigation.navigate("DishScreen", {
                                  restoId: route.params.restoId,
                                  bookingType: route.params.bookingType,
                                  day: route.params.day,
                                  hour: route.params.hour,
                                  menuid: menu.id,
                                });
                              }}
                            >
                              <ListItem.Content>
                                <ListItem.Title
                                  style={{
                                    marginTop: 5,
                                    color: textColor,
                                    fontSize: 15,
                                    fontFamily: "geometria-bold",
                                  }}
                                >
                                  {menu.title}{" "}
                                </ListItem.Title>

                                <ListItem.Subtitle
                                  style={{
                                    marginTop: 2,
                                    color: textColor,
                                    fontSize: 18,
                                    fontFamily: "geometria-regular",
                                  }}
                                >
                                  {menu.minPricevar? `À partir de ${menu.minPricevar}`: menu.price} €
                                </ListItem.Subtitle>

                              </ListItem.Content>
                              {menu && menu.imageUrl !== "" && (
                                <Avatar
                                  source={{ uri: menu.imageUrl || " " }}
                                />
                              )}
                              <ListItem.Chevron />
                            </ListItem>
                          </View>
                        );
                      }
                    })}
                  </View>
                );
              }
            })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  textcattitle: {
    fontFamily: "geometria-regular"
  },
  FlatList: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0,
  },
  wrapperScroll: {
    height: "90%",
  },
  title: {
    fontSize: 20,
    padding: 30,
    fontFamily: "geometria-bold"
  },
  text: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-bold",
  },
  minitext: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  dishComponent: {
    height: 120,
  },
  wrapindicator: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
  },
});

export default orderScreen;
