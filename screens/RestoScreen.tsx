import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Image, Route, StyleSheet } from "react-native";
import { Divider } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import HTML from "react-native-render-html";
import { NavigationScreenProp } from "react-navigation";
import { useSelector } from "react-redux";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { ProductItem } from "../global";
import { add, remove, emptyall, store } from "../store";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { sortBy } from "lodash";

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export const RestoScreen = ({ route, navigation }: Props) => {
  const [businessHoursTakeAway, setBusinessHoursTakeAway] = useState([
    {
      daysOfWeek: [],
      endTime: "",
      startTime: "",
    },
  ]);
  const [businessHoursDelivery, setBusinessHoursDelivery] = useState([
    {
      daysOfWeek: [],
      endTime: "",
      startTime: "",
    },
  ]);
  const [businessHours, setBusinessHours] = useState([
    {
      daysOfWeek: [],
      endTime: "",
      startTime: "",
    },
  ]);

  const [myintcust, setMyintcust] = useState({
    id: "",
    overviewpicUrl: " ",
    corporation: "",
    EngagModeOnSite: false,
    EngagModeTakeAway: false,
    EngagModeDelivery: false,
    introwebsite: "",
    style: "",
    adressvenue: "",
    zipvenue: "",
    cityvenue: "",
    onsitenoonblock: "",
    onsitenightblock: "",
    preswebsite: "",
    businessHoursTakeAway: [],
    businessHoursDelivery: [],
    businessHours: [],
    takeawaynoonblock: "",
    takeawaynightblock: "",
    deliverynightblock: "",
    deliverynoonblock: "",
    contactphone: "",
    noNightTakeAway: false,
    noNightDelivery: false,
  });
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
  // horaires
  // Limites de commande
  const products = useSelector((state: ProductItem[]) => state);
  const tagsStyles = {
    p: { fontFamily: "geometria-regular", fontSize: 18, color: textColor },
  };
  const html = myintcust.preswebsite;

  async function fetchIntcust() {
    var Intcust = Parse.Object.extend("Intcust");
    let myintcustRaw = new Intcust();
    myintcustRaw.id = route.params.restoId;
    myintcustRaw = {
      id: myintcustRaw.id || "",
      overviewpicUrl: myintcustRaw.attributes.overviewpic._url || "",
      corporation: myintcustRaw.attributes.corporation || "",
      EngagModeTakeAway: myintcustRaw.attributes.EngagModeTakeAway || false,
      EngagModeDelivery: myintcustRaw.attributes.EngagModeDelivery || false,
      introwebsite: myintcustRaw.attributes.introwebsite || "",
      EngagModeOnSite: myintcustRaw.attributes.EngagModeOnSite || false,
      style: myintcustRaw.attributes.style || "",
      adressvenue: myintcustRaw.attributes.adressvenue || "",
      zipvenue: myintcustRaw.attributes.zipvenue || "",
      cityvenue: myintcustRaw.attributes.cityvenue || "",
      businessHoursTakeAway: myintcustRaw.attributes.businessHoursTaway,
      businessHoursDelivery: myintcustRaw.attributes.businessHoursDelivery,
      businessHours: myintcustRaw.attributes.businesshours || [],
      preswebsite: myintcustRaw.attributes.preswebsite || "",
      onsitenoonblock: myintcustRaw.attributes.onsitenoonblock || "",
      onsitenightblock: myintcustRaw.attributes.onsitenightblock || "",
      takeawaynoonblock: myintcustRaw.attributes.takeawaynoonblock || "",
      takeawaynightblock: myintcustRaw.attributes.takeawaynightblock || "",
      deliverynoonblock: myintcustRaw.attributes.deliverynoonblock || "",
      deliverynightblock: myintcustRaw.attributes.deliverynightblock || "",
      contactphone: myintcustRaw.attributes.contactphone || "",
      noNightTakeAway: myintcustRaw.attributes.noNightTakeAway || false,
      noNightDelivery: myintcustRaw.attributes.noNightDelivery || false,
    };
    setMyintcust(myintcustRaw);
    console.log("ff");
    //console.log(myintcustRaw.businessHours);
    let results: any = [];
    let businessHours = sortBy(myintcustRaw.businessHours, ["daysOfWeek"]);
    await businessHours.forEach((element) => {
      if (element.daysOfWeek[0] == 1) {
        results.push({
          daysOfWeek: "Lundi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 2) {
        results.push({
          daysOfWeek: "Mardi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 3) {
        results.push({
          daysOfWeek: "Mercredi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 4) {
        results.push({
          daysOfWeek: "Jeudi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 5) {
        results.push({
          daysOfWeek: "Vendredi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 6) {
        results.push({
          daysOfWeek: "Samedi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 7) {
        results.push({
          daysOfWeek: "Dimanche",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
    });

    setBusinessHours(results);

    let resultsTakeAway: any = [];
    let businessHoursTakeAway = sortBy(myintcustRaw.businessHoursTakeAway, [
      "daysOfWeek",
    ]);
    await businessHoursTakeAway.forEach((element) => {
      if (element.daysOfWeek[0] == 1) {
        resultsTakeAway.push({
          daysOfWeek: "Lundi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 2) {
        resultsTakeAway.push({
          daysOfWeek: "Mardi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 3) {
        resultsTakeAway.push({
          daysOfWeek: "Mercredi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 4) {
        resultsTakeAway.push({
          daysOfWeek: "Jeudi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 5) {
        resultsTakeAway.push({
          daysOfWeek: "Vendredi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 6) {
        resultsTakeAway.push({
          daysOfWeek: "Samedi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 7) {
        resultsTakeAway.push({
          daysOfWeek: "Dimanche",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
    });
    setBusinessHoursTakeAway(resultsTakeAway);

    let resultsDelivery: any = [];
    let businessHoursDelivery = sortBy(myintcustRaw.businessHoursDelivery, [
      "daysOfWeek",
    ]);
    await businessHoursDelivery.forEach((element) => {
      if (element.daysOfWeek[0] == 1) {
        resultsDelivery.push({
          daysOfWeek: "Lundi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 2) {
        resultsDelivery.push({
          daysOfWeek: "Mardi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 3) {
        resultsDelivery.push({
          daysOfWeek: "Mercredi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 4) {
        resultsDelivery.push({
          daysOfWeek: "Jeudi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 5) {
        resultsDelivery.push({
          daysOfWeek: "Vendredi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 6) {
        resultsDelivery.push({
          daysOfWeek: "Samedi",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
      if (element.daysOfWeek[0] == 7) {
        resultsDelivery.push({
          daysOfWeek: "Dimanche",
          startTime: element.startTime,
          endTime: element.endTime,
        });
      }
    });
    setBusinessHoursDelivery(resultsDelivery);
  }
  useEffect(() => {
    fetchIntcust();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{}}>
          {myintcust && myintcust.overviewpicUrl && (
            <Image
              style={styles.image}
              source={{ uri: myintcust.overviewpicUrl }}
            />
          )}
          <Text style={styles.title}>{myintcust.corporation} </Text>
          <Text style={styles.textSub2}>{myintcust.style} </Text>
          <Text style={styles.textMoli}>📍{myintcust.adressvenue} </Text>
          <Text style={styles.textMoli}>
            {myintcust.zipvenue} {myintcust.cityvenue}
          </Text>
          <Text style={styles.textMoli}>☎️ {myintcust.contactphone}</Text>

          <Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />

          <Text style={styles.textItalic}>{myintcust.introwebsite} </Text>

          <View style={styles.wrapperHTML}>
            <HTML tagsStyles={tagsStyles} source={{ html: html || " " }} />
          </View>

          <Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />
          <Text style={styles.textMoli}>
            ☎️ Au delà de l'heure limite, merci de téléphoner :{" "}
            {myintcust.contactphone}
          </Text>
          <Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />

          {myintcust.EngagModeOnSite == true && (
            <View>
              <Text style={styles.textSub}>Réservation sur place </Text>

              {businessHours &&
                businessHours.length !== 0 &&
                businessHours.map((bh) => (
                  <Text
                    style={styles.textMoli}
                    key={bh.daysOfWeek + bh.startTime}
                  >
                    {bh.daysOfWeek} {bh.startTime}-{bh.endTime}
                  </Text>
                ))}
              <Text style={styles.textMoli}>
                Fin de commande le midi : {myintcust.onsitenoonblock}{" "}
              </Text>
              {myintcust.noNightTakeAway !== true && (
                <Text style={styles.textMoli}>
                  Fin de commande le soir : {myintcust.onsitenightblock}{" "}
                </Text>
              )}
              <Divider
                style={{ backgroundColor: "grey", marginVertical: 20 }}
              />
            </View>
          )}

          {myintcust.EngagModeTakeAway == true && (
            <View>
              <Text style={styles.textSub}>Commande à emporter </Text>
              {businessHoursTakeAway &&
                businessHoursTakeAway.length !== 0 &&
                businessHoursTakeAway.map((bh2: any) => (
                  <Text
                    style={styles.textMoli}
                    key={bh2.daysOfWeek + bh2.startTime}
                  >
                    {bh2.daysOfWeek} {bh2.startTime}-{bh2.endTime}
                  </Text>
                ))}
              <Text style={styles.textMoli}>
                Fin de commande le midi : {myintcust.takeawaynoonblock}{" "}
              </Text>
              {myintcust.noNightTakeAway !== true && (
                <Text style={styles.textMoli}>
                  Fin de commande le soir : {myintcust.takeawaynightblock}{" "}
                </Text>
              )}
              <Divider
                style={{ backgroundColor: "grey", marginVertical: 20 }}
              />
            </View>
          )}

          {myintcust.EngagModeDelivery == true && (
            <View>
              <Text style={styles.textSub}>Commande en livraison </Text>
              {businessHoursDelivery &&
                businessHoursDelivery.length !== 0 &&
                businessHoursDelivery.map((bh: any) => (
                  <Text
                    style={styles.textMoli}
                    key={bh.daysOfWeek + bh.startTime}
                  >
                    {bh.daysOfWeek} {bh.startTime}-{bh.endTime}
                  </Text>
                ))}
              <Text style={styles.textMoli}>
                Fin de commande le midi : {myintcust.deliverynoonblock}{" "}
              </Text>
              {myintcust.noNightDelivery !== true && (
                <Text style={styles.textMoli}>
                  Fin de commande le soir : {myintcust.deliverynightblock}{" "}
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
      <View style={{ flex: 0, marginTop: 10 }}>
        {myintcust && myintcust.EngagModeOnSite && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("crenSelectScreen", {
                restoId: myintcust.id,
                bookingType: "OnSite",
              });
            }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Réservez sur place</Text>
          </TouchableOpacity>
        )}
        {myintcust && myintcust.EngagModeTakeAway && (
          <TouchableOpacity
            onPress={() => {
              if (products.length > 0 && products[0].restoId !== myintcust.id) {
                Alert.alert(
                  "",
                  "Vous avez déjà initié une commande avec un autre restaurant. Si vous continuez votre panier sera remis à zéro.",
                  [
                    {
                      text: "Revenir",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Continuer",
                      onPress: () => {
                        store.dispatch(emptyall(products));
                        navigation.navigate("crenSelectScreen", {
                          restoId: myintcust.id,
                          bookingType: "TakeAway",
                        });
                      },
                    },
                  ]
                );
              } else {
                navigation.navigate("crenSelectScreen", {
                  restoId: myintcust.id,
                  bookingType: "TakeAway",
                });
              }
            }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Commandez à emporter</Text>
          </TouchableOpacity>
        )}
        {myintcust && myintcust.EngagModeTakeAway && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("crenSelectScreen", {
                restoId: myintcust.id,
                bookingType: "Delivery",
              });
            }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Commandez en livraison</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScrollRaw: {
    height: "100%",
  },
  containerScroll: {
    height: 100,
  },
  image: {
    height: 400,
    resizeMode: "cover",
  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 10,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight: 30,
    marginLeft: 30,

    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    //textTransform: "uppercase",
    fontFamily: "geometria-bold",
  },
  wrapperHTML: {
    marginHorizontal: 20,
    marginTop: 10,
    fontFamily: "geometria-regular",
  },
  title: {
    //  flex:1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 20,
    paddingBottom: 10,

    fontFamily: "geometria-bold",
    fontWeight: "bold",
  },
  text: {
    flex: 1,
    fontSize: 20,
    top: 0,
    fontFamily: "geometria-regular",
    paddingLeft: 20,
  },
  textMoli: {
    flex: 1,
    fontSize: 18,
    top: 0,
    fontFamily: "geometria-regular",
    paddingLeft: 20,
    marginRight: 10,
  },
  textItalic: {
    flex: 1,
    fontSize: 19,
    top: 0,
    fontFamily: "geometria-regular",
    paddingLeft: 20,
    fontStyle: "italic",
  },
  textSub: {
    flex: 1,
    fontSize: 20,
    fontFamily: "geometria-bold",
    paddingLeft: 20,
    paddingTop: 10,
  },
  textSub2: {
    flex: 1,
    fontSize: 20,
    fontFamily: "geometria-bold",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
export default RestoScreen;
