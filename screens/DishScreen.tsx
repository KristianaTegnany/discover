import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Route,
  StyleSheet,
} from "react-native";
import { ListItem } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { add, store } from "../store";
import { useEffect } from "react";
import { useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import RadioButton from "../components/Radio";

const TAKEAWAY = "TakeAway",
  DELIVERY = "Delivery";

interface NavigationParams {
  restoId: string;
  bookingType: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

interface IMenu {
  id: string;
  imageUrl: any;
  title: string;
  description: string;
  formulaChoiced: [];
  persoMenu: [];
  price: number;
  pricevarcheck?: boolean;
  pricevars?: { name: string; price: string; }[]
}

export const DishScreen = ({ route, navigation }: Props) => {
  const bookingType = route.params.bookingType
  const [menu, setMenu] = useState<IMenu>();
  const [initied, setInitied] = useState(false);
  const [persoMenu, setPersoMenu] = useState<any[]>();
  const [formulaChoiced, setFormulaChoiced] = useState<any[]>();
  const [selectedVarIndex, setSelectedVarIndex] = useState<number>(-1);

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

  async function fetchMenu() {
    var Menu = Parse.Object.extend("Menu");
    let menu = new Menu();
    menu.id = route.params.menuid;
    await menu.fetch();
    let menuRaw = {
      id: menu.id,
      imageUrl: (menu.attributes.image && menu.attributes.image._url) || false,
      title: menu.attributes.title,
      description: menu.attributes.description,
      formulaChoiced: menu.attributes.formulaChoice || [],
      persoMenu: menu.attributes.persoMenu,
      price: Number(menu.attributes.price),
      quantity: 1,
      resto: menu.attributes.intcust.id,
      pricevarcheck: menu.attributes.pricevarcheck,
      pricevars: (menu.attributes.pricevars && menu.attributes.pricevars.length > 0) ? menu.attributes.pricevars.map((pricevar: any) => {
        return {
          name: pricevar.name,
          price: bookingType === DELIVERY ? pricevar.pricevardelivery : bookingType === TAKEAWAY ? pricevar.pricevartakeaway : pricevar.pricevaronsite
        }
      }) : undefined
    };
    setMenu(menuRaw);
    setFormulaChoiced(menuRaw.formulaChoiced);
    setPersoMenu(menuRaw.persoMenu);
  }

  function handleChangePersoMenu(pers: any, value: any) {
    if (persoMenu) {
      const i = persoMenu?.findIndex((item: any) => item.name == pers);
      const j = persoMenu[i].values.findIndex(
        (item: any) => item.value == value
      );
      persoMenu[i].values[j].checked = !persoMenu[i].values[j].checked;
      persoMenu[i].numChecked = (persoMenu[i].numChecked || 0) + 1;
      if (pers.price == 0 || !pers.price) {
        persoMenu[i].numCheckedFree = (persoMenu[i].numCheckedFree || 0) + 1;
      } else if (pers.price && pers.price > 0) {
        persoMenu[i].numCheckedPaid = (persoMenu[i].numCheckedPaid || 0) + 1;
      }
      setPersoMenu([...persoMenu]);
    }
  }
  useEffect(() => {
    fetchMenu();
  }, []);

  function addFormulaChoice(cattitle: any, menutitle: any) {
    if (formulaChoiced && initied == false) {
      const i = formulaChoiced.findIndex(
        (item: any) => item.cattitle == cattitle
      );
      const j = formulaChoiced[i].menus.findIndex(
        (item: any) => item.title == menutitle
      );
      formulaChoiced[i].numChoiced = 1;
      formulaChoiced[i].sumtot = formulaChoiced[i].menus[j].tar || 0;
      formulaChoiced[i].menus[j].quantity = 1;
      setFormulaChoiced([...formulaChoiced]);
      setInitied(true);
    } else if (formulaChoiced && initied == true) {
      const i = formulaChoiced.findIndex(
        (item: any) => item.cattitle == cattitle
      );
      const j = formulaChoiced[i].menus.findIndex(
        (item: any) => item.title == menutitle
      );
      formulaChoiced[i].menus[j].quantity =
        (formulaChoiced[i].menus[j].quantity || 0) + 1;
      formulaChoiced[i].numChoiced = (formulaChoiced[i].numChoiced || 0) + 1;
      formulaChoiced[i].sumtot =
        (formulaChoiced[i].sumtot || 0) + (formulaChoiced[i].menus[j].tar || 0);
      setInitied(true);
      setFormulaChoiced([...formulaChoiced]);
    }
  }

  function removeFormulaChoice(cattitle: any, menutitle: any) {
    if (formulaChoiced && initied == false) {
    } else if (formulaChoiced && initied == true) {
      const i = formulaChoiced.findIndex(
        (item: any) => item.cattitle == cattitle
      );
      const j = formulaChoiced[i].menus.findIndex(
        (item: any) => item.title == menutitle
      );
      formulaChoiced[i].menus[j].quantity =
        (formulaChoiced[i].menus[j].quantity || 0) - 1;
      if (formulaChoiced[i].menus[j].quantity < 0) {
        formulaChoiced[i].menus[j].quantity = 0;
      }
      formulaChoiced[i].numChoiced = (formulaChoiced[i].numChoiced || 0) - 1;
      if (formulaChoiced[i].numChoiced < 0) {
        formulaChoiced[i].numChoiced = 0;
      }
      formulaChoiced[i].sumtot =
        (formulaChoiced[i].sumtot || 0) - (formulaChoiced[i].menus[j].tar || 0);
      if (formulaChoiced[i].sumtot < 0) {
        formulaChoiced[i].sumtot = 0;
      }
      setInitied(true);
      setFormulaChoiced([...formulaChoiced]);
    }
  }

  async function addToBasket() {
    if (menu?.pricevarcheck && selectedVarIndex === -1) {
      Alert.alert('Veuillez choisir la variation souhaitée')
      return
    }
    let Stop = false;

    formulaChoiced?.forEach((fc) => {
      if (fc.numChoiced > fc.numExact) {
        Alert.alert(
          "Vous ne pouvez sélectionner que " + fc.numExact + " " + fc.cattitle
        ) + ". Merci de corriger votre choix.";
        Stop = true;
      }
      if (!fc.numChoiced && fc.numExact > 0) {
        Alert.alert("Vous devez choisir " + fc.numExact + " " + fc.cattitle) +
          ". Merci de corriger votre choix";
        Stop = true;
      }
      if (fc.numChoiced && fc.numChoiced < fc.numExact) {
        Alert.alert("Vous devez choisir " + fc.numExact + " " + fc.cattitle) +
          ". Merci de corriger votre choix";
        Stop = true;
      }
    });

    persoMenu?.forEach((perso) => {
      if (
        perso.mandatory == true &&
        (!perso.numChecked || perso.numChecked < 1)
      ) {
        Alert.alert(
          "Vous devez sélectionner : " +
          perso.name +
          ". Merci de corriger votre choix."
        );
        Stop = true;
      }
    });

    if (Stop == false) {
      formulaChoiced?.forEach((fc: any, index: any) => {
        fc.menus = fc.menus.filter((menu: any) => menu.quantity);
      });

      let fcRaw = formulaChoiced?.filter((x: any) => x.menus.length > 0);

      persoMenu?.forEach((pers: any, index: any) => {
        pers.values = pers.values.filter((value: any) => value.checked == true);
      });

      let persoRaw = persoMenu?.filter((x: any) => x.values.length > 0);

      const pricevars = (menu?.pricevarcheck && menu?.pricevars && selectedVarIndex > -1) ? { amount: menu?.pricevars[selectedVarIndex].price, pricevar: menu?.pricevars[selectedVarIndex].name } : {}

      let menuRaw = {
        id: menu?.id,
        restoId: route.params.restoId,
        name: menu?.title,
        description: menu?.description,
        amount: menu?.price,
        ...pricevars,
        currency: "eur",
        quantity: 1,
        persoData: persoRaw || [],
        formulaChoiced: fcRaw || [],
      };

      Alert.alert("", "Très bon choix 👌🏽");

      store.dispatch(add(menuRaw));

      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      {!menu && (
        <View key="123" style={styles.wrapindicator}>
          <ActivityIndicator size="large" color="#F50F50" />
        </View>
      )}
      <ScrollView style={styles.scrollview}>
        {menu && menu.imageUrl && (
          <Image style={styles.image} source={{ uri: menu.imageUrl }} />
        )}
        {menu && <Text style={styles.title}>{menu.title} </Text>}
        {
          menu?.pricevarcheck && menu?.pricevars && menu?.pricevars?.length > 0 && menu.pricevars.map((pricevar, i) => (
            <View style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }} key={i}>
              <RadioButton
                onPress={() => {
                  setSelectedVarIndex(i)
                }}
                color="#ff5050"
                status={selectedVarIndex === i ? "checked" : "unchecked"}
                value={selectedVarIndex === i}
                style={{ marginRight: 20 }}
              />
              <Text>{pricevar.name}{' '}{pricevar.price}€</Text>
            </View>
          ))

        }
        {menu && !menu.pricevarcheck && <Text style={[styles.textCat2]}>{menu.price}€ </Text>}

        {menu && <Text style={styles.text}>{menu.description} </Text>}

        <View>
          {formulaChoiced &&
            formulaChoiced.map((fccat: any, index4: any) => (
              <View key={fccat.cattitle + index4}>
                <ListItem
                  key={fccat.cattitle + index4}
                  bottomDivider
                  containerStyle={{
                    backgroundColor: "#ff5050",
                    borderColor: "#ff5050",
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.textCat}>
                      {" "}
                      {fccat.cattitle}{" "}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                {fccat.numExact > 0 && (
                  <ListItem
                    key={fccat.cattitle + index4 + "numexcr"}
                    bottomDivider
                    containerStyle={{
                      backgroundColor: "#ffc1c1",
                      borderColor: "#ffc1c1",
                    }}
                  >
                    <ListItem.Content>
                      {fccat.numExact > 1 && (
                        <ListItem.Title style={styles.textCat}>
                          {" "}
                          {fccat.numExact} choix exact.s obligatoire.s
                        </ListItem.Title>
                      )}
                      {fccat.numExact < 2 && (
                        <ListItem.Title style={styles.textCat}>
                          {" "}
                          {fccat.numExact} choix exact obligatoire
                        </ListItem.Title>
                      )}
                    </ListItem.Content>
                  </ListItem>
                )}

                {fccat &&
                  fccat.menus.map((menu: any, index5: any) => (
                    <ListItem
                      key={menu.title + index5}
                      containerStyle={{ backgroundColor: backgroundColor }}
                      bottomDivider
                    >
                      <ListItem.Content>
                        <ListItem.Title
                          style={{
                            marginTop: 9,
                            color: textColor,
                            fontSize: 16,
                            fontFamily: "geometria-regular",
                          }}
                        >
                          {menu.title}{" "}
                        </ListItem.Title>

                        {menu.tar > 0 && (
                          <ListItem.Subtitle
                            style={{
                              marginTop: 2,
                              color: textColor,
                              fontSize: 14,
                              fontFamily: "geometria-regular",
                            }}
                          >
                            {menu.tar} €{" "}
                          </ListItem.Subtitle>
                        )}
                      </ListItem.Content>
                      <Ionicons
                        name="remove-circle"
                        style={styles.searchIcon}
                        onPress={() =>
                          removeFormulaChoice(fccat.cattitle, menu.title)
                        }
                      />
                      <ListItem.Subtitle
                        style={{
                          marginTop: 2,
                          color: textColor,
                          fontSize: 18,
                          fontFamily: "geometria-regular",
                        }}
                      >
                        {" "}
                        {formulaChoiced[index4].menus[index5].quantity || 0}
                      </ListItem.Subtitle>
                      <Ionicons
                        name="add-circle"
                        style={styles.searchIcon}
                        onPress={() =>
                          addFormulaChoice(fccat.cattitle, menu.title)
                        }
                      />
                    </ListItem>
                  ))}
              </View>
            ))}
        </View>

        {persoMenu &&
          persoMenu.map((pers: any, index4: any) => (
            <View key={pers.name + index4}>
              <ListItem
                key={pers.name}
                bottomDivider
                containerStyle={{
                  backgroundColor: "#ff5050",
                  borderColor: "#ff5050",
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={styles.textCat}>
                    {" "}
                    {pers.name}{" "}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>

              {pers.mandatory == true && (
                <ListItem
                  key={pers.name + "mandatory"}
                  bottomDivider
                  containerStyle={{
                    backgroundColor: "#ffc1c1",
                    borderColor: "#ff5050",
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.textCat}>
                      Sélection obligatoire. Max Gratuit :{pers.max} - Payant :{" "}
                      {pers.maxpaid}{" "}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              )}

              {pers.values &&
                pers.values.map((value: any, index8: any) => (
                  <View key={value.value + "view"}>
                    {value.checked == true && (
                      <TouchableOpacity
                        onPress={() =>
                          handleChangePersoMenu(pers.name, value.value)
                        }
                        style={{
                          elevation: 8,
                          marginTop: 10,
                          marginHorizontal: 9,
                          marginBottom: 10,
                          borderWidth: 1,
                          backgroundColor: "#ff5050",
                          borderColor: "transparent",
                          borderRadius: 10,
                          padding: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            alignSelf: "center",
                            fontFamily: "geometria-bold",
                            color: textColor,
                          }}
                        >
                          {value.value}{" "}
                          {value.price && value.price > 0 && "+" + value.price + "€" || ""}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {(value.checked == false || !value.checked) && (
                      <TouchableOpacity
                        onPress={() =>
                          handleChangePersoMenu(pers.name, value.value)
                        }
                        style={{
                          elevation: 8,
                          marginTop: 10,
                          marginHorizontal: 9,
                          marginBottom: 10,
                          borderWidth: 1,
                          backgroundColor: "transparent",
                          borderColor: "grey",
                          borderRadius: 10,
                          padding: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            alignSelf: "center",
                            fontFamily: "geometria-bold",
                            color: textColor,
                          }}
                        >
                          {value.value}{" "}
                          {value.price && value.price > 0 && "+" + value.price + "€" || ""}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => addToBasket()}
        style={styles.appButtonContainer}
      >
        <Text style={styles.appButtonText}>🧺 Ajouter au panier</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 400,
    resizeMode: "cover",
  },

  appButtonTextCheckbox: {
    fontSize: 16,
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  appButtonContainer: {
    elevation: 8,
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  searchIcon: {
    color: "grey",
    fontSize: 30,
    marginLeft: 5,
    marginRight: 1,
  },
  scrollview: {
    height: "100%",
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
    fontFamily: "geometria-bold",
    textTransform: "uppercase",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 20,
    fontFamily: "geometria-bold"
  },
  text: {
    flex: 1,
    fontFamily: "geometria-regular",
    fontSize: 16,
    padding: 20,
  },
  wrapindicator: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  textCat: {
    flex: 1,
    fontFamily: "geometria-bold",
    fontSize: 16,
    color: "white",
  },
  textCat2: {
    paddingLeft: 20,
    flex: 1,
    fontFamily: "geometria-bold",
    fontSize: 16
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default DishScreen;
