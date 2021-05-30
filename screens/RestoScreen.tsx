import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, TouchableOpacity, Image, Route, StyleSheet, ScrollView } from "react-native";
import { Avatar, Divider, ListItem } from "react-native-elements";
import HTML from "react-native-render-html";
import { NavigationScreenProp } from "react-navigation";
import { useSelector } from "react-redux";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { ProductItem } from "../global";
import { emptyall, store } from "../store";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { sortBy } from "lodash";
import Modal from 'react-native-modal';
import { Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
DropDownPicker.addTranslation("FR", {
  PLACEHOLDER: "Sélectionnez un élément",
  SEARCH_PLACEHOLDER: "Tapez quelque chose...",
  SELECTED_ITEMS_COUNT_TEXT: "\d éléments ont été sélectionnés",
  NOTHING_TO_SHOW: "Il n'y a rien à montrer!"
});
DropDownPicker.setLanguage("FR");
import { newRidgeState } from "react-ridge-state";

export const stripeAccIdResto = newRidgeState<string>('acct_1FwTt6GC5CDQhYZj'); // 0 could be something else like objects etc. you decide!

interface NavigationParams {
  restoId: string;
  day: string;
  hour: string;
  text: string;
  bookingType: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}


interface IMenus {
  id: string;
  price: number;
  imageUrl: string;
  title: string;
  order: number;
  description: string;
  category: string;
}
interface ICats {
  id: string;
  title: string;
  order: number;
  numExact: number;
}
export const RestoScreen = ({ route, navigation }: Props) => {
  const [menus, setMenus] = useState<IMenus[]>();
  const [cats, setCats] = useState<ICats[]>();
  const [stripeAccIdRestoValue, setstripeAccIdRestoValue] = stripeAccIdResto.use();

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
    preswebsite: " ",
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
    minOrderDelivery:0,
    citiesChoice:[],
    stripeAccId:'',
    delayorderDelivery:0,
    confirmModeOrderOptions_delayorder:0
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

  const products = useSelector((state: ProductItem[]) => state);
  const tagsStyles = {
    p: { fontFamily: "geometria-regular", fontSize: 18, color: textColor },
  };


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
      .map((menu: any) => ({
        id: menu.id,
        price: menu.attributes.price,
        title: menu.attributes.title,
        category: menu.attributes.category,
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

  //Cren
  const [bookingType, setBookingType] = useState(route.params.bookingType)
  const [daystobook, setDaystobook] = useState<ItemType[]>([]);
  const [hourstobook, setHourstobook] = useState<ItemType[]>([]);
  const { day, hour } = route.params;
  const [crenModalVisible, setCrenModalVisible] = useState(route.params.day === "null" || route.params.day !== undefined)
  const [selectedDay, setSelectedDay] = useState<any>(day && day !== 'null'? day : "");
  const [selectedHour, setSelectedHour] = useState<any>(hour ? hour : "");
  const [openDate, setOpenDate] = useState(false);
  const [openHour, setOpenHour] = useState(false);
  const [goto, setGoto] = useState("Aaa");
  const [loading, setLoading] = useState(true);

  async function fetchHours() {
    setLoading(true);
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = route.params.restoId;
    let params2 = {
      itid: route.params.restoId,
      date: moment.tz(selectedDay, "YYYY-MM-DD", "America/Martinique").toDate(), //moment.tz(date.substr(0, 10), 'America/Martinique').format(),
      bookingType: bookingType,
    };
    const res3 = await Parse.Cloud.run("getIntcustWithAvailableCren", params2);
    setHourstobook(
      res3.crenAvailable.map((cren: any) => {
        return {
          label: cren,
          value: cren,
        };
      })
    );

    if (["Delivery", "TakeAway"].includes(bookingType)) {
      setGoto("orderScreen");
    } else if (bookingType == "OnSite") {
      setGoto("resaScreen");
    }
    setLoading(false);
  }

  function fetchDays() {
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = route.params.restoId;
    var businessHours = [];
    if (bookingType == "TakeAway") {
      businessHours = intcustRaw.get("businessHoursTaway");
    } else if (bookingType == "Delivery") {
      businessHours = intcustRaw.get("businessHoursDelivery");
    } else if (bookingType == "OnSite") {
      businessHours = intcustRaw.get("businesshours");
    }
    let day = moment();
    let days = [];
    var i;
    for (i = 0; i < 30; i++) {
      let index1 = businessHours.findIndex(
        (bh: any) => bh.daysOfWeek == day.isoWeekday()
      );
      if (index1 >= 0) {
        // tester si inclus dans les business hours et pas dans les blocks events
        days.push({
          label: day.format("dddd DD MMM"),
          value: moment.tz(day, "America/Martinique").format("YYYY-MM-DD"),
        });
      }
      day.add(1, "day");
    }
    if(days.length > 0)
      setSelectedDay(days[0].value);
    setDaystobook(days);
    setLoading(false);
  }
  function getCountOfMenusOfcat(cattitle: string) {
    if (menus) {
      let count = menus.filter((x: any) => x.category == cattitle).length;
      return count;
    }
  }
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
      preswebsite: myintcustRaw.attributes.preswebsite || " ",
      onsitenoonblock: myintcustRaw.attributes.onsitenoonblock || "",
      onsitenightblock: myintcustRaw.attributes.onsitenightblock || "",
      takeawaynoonblock: myintcustRaw.attributes.takeawaynoonblock || "",
      takeawaynightblock: myintcustRaw.attributes.takeawaynightblock || "",
      deliverynoonblock: myintcustRaw.attributes.deliverynoonblock || "",
      deliverynightblock: myintcustRaw.attributes.deliverynightblock || "",
      contactphone: myintcustRaw.attributes.contactphone || "",
      noNightTakeAway: myintcustRaw.attributes.noNightTakeAway || false,
      noNightDelivery: myintcustRaw.attributes.noNightDelivery || false,
      minOrderDelivery: myintcustRaw.attributes.minOrderDelivery || 0,
      citiesChoice: myintcustRaw.attributes.citiesChoice2 || [],
      stripeAccId: myintcustRaw.attributes.stripeAccId || '',
      delayorderDelivery: myintcustRaw.attributes.delayorderDelivery || 0,
      confirmModeOrderOptions_delayorder:  myintcustRaw.attributes.confirmModeOrderOptions_delayorder || 0,
    };
    setMyintcust(myintcustRaw);
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

  const CrenSelectScreen = () => {
    return (
      <View style={[styles.crenContainer,  { backgroundColor, height: openDate? 520 : openHour? 580 : 280 }]}>
         
          
        <Text style={[styles.dateText, { color: textColor, fontFamily:'geometria-regular' }]}>
          Sélectionnez la date
        </Text>
        <DropDownPicker
          open={openDate}
          value={selectedDay}
          items={daystobook}
          setOpen={setOpenDate}
          setValue={setSelectedDay}
          setItems={setDaystobook}
          placeholder="Date ..."
          maxHeight={300}
          style={[styles.dropdown]}
          labelStyle={styles.labeldropdown}
          textStyle={{fontFamily:'geometria-regular', color:"white"}}
          placeholderStyle={styles.labeldropdown}
          zIndex={3000}
          zIndexInverse={1000}
          dropDownContainerStyle={styles.dropdown}
        />
      

        <Text style={[styles.hourText, { color: textColor,  fontFamily:'geometria-regular', marginTop: openDate? 120 : 20 }]}>
          Sélectionnez l'heure 
        </Text>
        <DropDownPicker
          open={openHour}
          value={selectedHour}
          items={hourstobook}
          setOpen={setOpenHour}
          zIndex={2000}
          zIndexInverse={2000}
          setValue={setSelectedHour}
          setItems={setHourstobook}
          textStyle={{fontFamily:'geometria-regular', color:"white"}}
          placeholder="Heure ..."
          maxHeight={300}
          style={[styles.dropdown]}
          labelStyle={styles.labeldropdown}
          placeholderStyle={styles.labeldropdown}
          dropDownContainerStyle={styles.dropdown}
        />

        {
          !openDate &&
          <View
            style={[
              styles.btnNextContainer,
              
              { opacity: selectedDay === "" || selectedHour === "" ? 0.5 : 1 },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("pressed to go")
                console.log(selectedDay)

                setCrenModalVisible(false)
                console.log(myintcust)
                console.log(typeof myintcust.stripeAccId)

                setstripeAccIdRestoValue(myintcust.stripeAccId)
                navigation.navigate(goto, {
                  restoId: route.params.restoId,
                  bookingType: bookingType,
                  day: moment.tz(selectedDay, "YYYY-MM-DD", "America/Martinique").format(),
                  hour: selectedHour,
                })
              }}
              style={styles.btnNext}
              disabled={selectedDay === "" || selectedHour === ""}
            >
              <Ionicons
                name="arrow-back"
                size={25}
                color="white"
                style={styles.arrow}
              />
            </TouchableOpacity>
          </View>
        }
        {selectedDay !== "" &&
          !loading &&
          hourstobook &&
          hourstobook.length == 0 && (
            <View style={{ backgroundColor:"transparent" }}>
              <Text style={styles.textstrong}>
                Plus d'horaires disponibles ! 🤷🏽‍♂️
              </Text>
           
            </View>
          )}
        {loading && (
          <View style={styles.wrapindicator}>
            <ActivityIndicator size="large" color="#F50F50" />
          </View>
        )}
      </View>
    )
  }

  useEffect(() => {
    fetchIntcust();
    fetchCatsAndMenus();
  }, []);

  useEffect(() => {
    if(day === "null" || day !== undefined)
      setCrenModalVisible(true)
  }, [route.params])

  useEffect(() => {
    fetchDays()
  }, [bookingType])

  useEffect(() => {
    if (crenModalVisible && selectedDay) fetchHours();
  }, [selectedDay]);

  return (
    <View style={styles.container}>
      <Modal
        isVisible={crenModalVisible}
        swipeDirection="down"
        onModalHide={() => { setOpenDate(false); setOpenHour(false); }}
        onSwipeComplete={(e) => setCrenModalVisible(false)}
        onBackButtonPress={() => setCrenModalVisible(false)}
        onBackdropPress={() => setCrenModalVisible(false)}
        style={{padding: 0, margin: 0, height: 280}}
      >
        <CrenSelectScreen/>
      </Modal>
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
          
          { myintcust.preswebsite && 
          <View style={styles.wrapperHTML}>
            <HTML tagsStyles={tagsStyles} source={{ html: myintcust.preswebsite || "<p>a</p> " }} />
          </View> 
          }

{(myintcust.EngagModeTakeAway== true || myintcust.EngagModeDelivery==true) && 
<View>
  <Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />

          <Text style={styles.textMoli}>
            ☎️ Au delà de l'heure limite, merci de téléphoner :{" "}
            {myintcust.contactphone}
          </Text>

          </View>
}

          {myintcust.EngagModeOnSite == true && (

<View>
<Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />

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
            
            </View>
          )}

          {myintcust.EngagModeTakeAway == true && (
            <View>
                        <Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />

              <Text style={styles.textSub}>Commande à emporter </Text>
              {businessHoursTakeAway &&
                businessHoursTakeAway.length !== 0 &&
                businessHoursTakeAway.map((bh2: any) => (
                  <Text
                    style={styles.textPiti}
                    key={bh2.daysOfWeek + bh2.startTime}
                  >
                    {bh2.daysOfWeek} {bh2.startTime}-{bh2.endTime}
                  </Text>
                ))}
              <Text style={styles.textMoli}>
              🕛 Fin de commande le midi : {myintcust.takeawaynoonblock}{" "}
              </Text>
              {myintcust.noNightTakeAway !== true && (
                <Text style={styles.textMoli}>
                 🕡 Fin de commande le soir : {myintcust.takeawaynightblock}{" "}
                </Text>
              )}
                 {myintcust.confirmModeOrderOptions_delayorder >0 && (
              <Text style={styles.textMoli}>
                Délai entre la commande et la récupération : {myintcust.confirmModeOrderOptions_delayorder}{" "} minutes
              </Text>
                            )}
           
            </View>
          )}

          {myintcust.EngagModeDelivery == true && (
            <View>
                 <Divider
                style={{ backgroundColor: "grey", marginVertical: 20 }}
              />
              <Text style={styles.textSub}>Commande en livraison </Text>
              {businessHoursDelivery &&
                businessHoursDelivery.length !== 0 &&
                businessHoursDelivery.map((bh: any) => (
                  <Text
                    style={styles.textPiti}
                    key={bh.daysOfWeek + bh.startTime}
                  >
                    {bh.daysOfWeek} {bh.startTime}-{bh.endTime}
                  </Text>
                ))}
              <Text style={styles.textMoli}>
               🕛 Fin de commande le midi : {myintcust.deliverynoonblock}{" "}
              </Text>
              {myintcust.noNightDelivery !== true && (
                <Text style={styles.textMoli}>
                 🕡 Fin de commande le soir : {myintcust.deliverynightblock}{" "}
                </Text>
              )}
               {myintcust.delayorderDelivery >0 && (
              <Text style={styles.textMoli}>
                Délai entre la commande et la livraison : {myintcust.delayorderDelivery}{" "} minutes
              </Text>
                            )}
{  myintcust.minOrderDelivery >0  && (
                  <View>
                <Text style={styles.textMoli}>
                 Minimum de commande en livraison : {myintcust.minOrderDelivery||0}€
                </Text>
                </View>
                )
              }
                        <Divider style={{ backgroundColor: "grey", marginVertical: 20 }} />

                 <Text 
                style={styles.textSub}>
                Zone de livraison
                </Text>
                  { myintcust.citiesChoice && myintcust.citiesChoice.length>0   && myintcust.citiesChoice.map((city:any) =>(
                <Text key={city.city}
                style={styles.textMoli}>
                {city.city || ' '} : {city.tar|| 0}€
                </Text>
                  ))}
                  
            </View>
          )}
        
<View>
<Divider
                style={{ backgroundColor: "grey", marginVertical: 20 }}
              />

  <View>
<Text  key="1" style={styles.title}>La Carte</Text>
{(myintcust.EngagModeDelivery==true || myintcust.EngagModeTakeAway==true) && 
<View>
<Text  style={styles.textMoli}>Pour commander, choisissez votre mode.</Text>
<Text  style={styles.textMoli}></Text>
</View>
}
</View>


          {!cats ||
            (!menus &&
              [""].map(() => {
                <View key="123" style={styles.wrapindicator}>
                  <ActivityIndicator size="large" color="#F50F50" />
                </View>;
              }))}
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
                     //   borderColor: "#ff5050",
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
                              onPress={() => {
                                Alert.alert("Merci de choisir un mode ci-dessous.")
                              }}
                              bottomDivider
                              containerStyle={{
                                backgroundColor: backgroundColor,
                              }}
                             
                            >
                             

                              <ListItem.Content>
                                <ListItem.Title
                                  style={{
                                    marginTop: 5,
                                    color: textColor,
                                    fontSize: 20,
                                    fontFamily: "geometria-bold",
                                  }}
                                >
                                  {menu.title}{" "}
                                </ListItem.Title>

{menu.price > 0 && 
                                <ListItem.Subtitle
                                  style={{
                                    marginTop: 2,
                                    color: textColor,
                                    fontSize: 18,
                                    fontFamily: "geometria-regular",
                                  }}
                                >
                                  {menu.price} €
                                </ListItem.Subtitle>
                      }
                              </ListItem.Content>
                              {menu && menu.imageUrl !== "" && (
                                <Avatar
                                 
                                  source={{ uri: menu.imageUrl || " " }}
                                />
                              )}
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
      <View style={{ flex: 0, marginTop: 10 }}>
        {myintcust && myintcust.EngagModeOnSite && (
          <TouchableOpacity
            onPress={() => {
              setBookingType("OnSite")
              setCrenModalVisible(true)
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
                        setBookingType("TakeAway")
                        setCrenModalVisible(true)
                      }
                    },
                  ]
                );
              } else {
                setBookingType("TakeAway")
                setCrenModalVisible(true)
              }
            }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Commandez à emporter</Text>
          </TouchableOpacity>
        )}
        {myintcust && myintcust.EngagModeDelivery && (
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
                        setBookingType("Delivery")
                        setCrenModalVisible(true)
                      }
                    },
                  ]
                );
              } else {
                setBookingType("Delivery")
                setCrenModalVisible(true)
              }
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
  //  fontWeight: "bold",
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
   // fontWeight: "bold",
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
  textcattitle: {
   // fontWeight: "bold",
 //  backgroundColor: "#fzfzfz",
    fontFamily: "geometria-regular",
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
  textPiti: {
    flex: 1,
    fontSize: 15,
    fontFamily: "geometria-regular",
    paddingLeft: 30,
    paddingBottom: 10,
    paddingTop: 10,

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  crenContainer: {
    position:'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderRadius: 10, 
  },
  dropdown: {
    borderColor: "transparent",
    backgroundColor: "#ff5050",
    color:'white',
    fontFamily:'geometria-regular'
  },
  labeldropdown: {
    color: "white",
  //  fontWeight: "bold",
    fontFamily:'geometria-bold'
  },
  dateText: {
    marginBottom: 10,
    fontSize: 14,
    color:'white',
    fontFamily:'geometria-bold'
  },
  hourText: {
    fontFamily:'geometria-bold',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    color:'white'
  },
  btnNextContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 25,
    color:'white',
    backgroundColor: "#ff5050"
  },
  btnNext: {

    height: 50,
    width: 50,
    color:'white',
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
  wrapindicator: {
  position: "absolute",
    alignItems: "center",
    top: "50%",
    left: "50%",
    justifyContent: "center",
    zIndex: 20000,
    backgroundColor: 'transparent'
  },
  textstrong: {
  //  fontWeight: "bold",
    fontFamily: "geometria-bold",
    paddingVertical: 20,
    fontSize: 18,
    paddingLeft: 4,
    backgroundColor:'transparent'
  },
  crenText: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  shadow: {
   // elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
export default RestoScreen;
