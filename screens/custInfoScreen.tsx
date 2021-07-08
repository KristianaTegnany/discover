import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import {
  Route,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { useSelector } from "react-redux";
import { ProductItem } from "../global";
import { useEffect } from "react";
import { useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import * as EmailValidator from "email-validator";
import { FontAwesome5 } from "@expo/vector-icons";
import RadioButton from "../components/Radio";
import moment from "moment-timezone";
moment.tz.add(
  "America/Martinique|FFMT AST ADT|44.k 40 30|0121|-2mPTT.E 2LPbT.E 19X0|39e4"
);
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

const TAKEAWAY = "TakeAway",
  DELIVERY = "Delivery";

export const custInfoScreen = ({ route, navigation }: Props) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);

  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [delifare, setDelifare] = useState(0);
  const [intcustCityChoice, setIntcustCityChoice] = useState([
    {
      city: "",
      tar: 0,
      checked: false,
    },
  ]);
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [notecom, setNotecom] = useState();
  const [resa, setResa] = useState({
    id: "",
    engagModeResa: "",
    guestFlat: [{ email: "" }],
  });
  const [paylink, setPaylink] = useState();
  const [totalCashBasket, setTotalCashBasket] = useState(0);
  const [intcust, setIntcust] = useState({
    id: "",
    apikeypp: "",
    corporation: "",
    paymentChoice: "",
    option_DeliveryByNoukarive: false,
    option_DeliveryByToutAlivrer: false,
    stripeAccId: "",
    orderDaily_StopTaway: 0,
    orderCren_StopTaway: 0,
    confirmModeOrderOptions_shiftinterval: 0,
    orderDaily_StopDelivery: 0,
    orderCren_StopDelivery: 0,
    confirmModeOrderOptions_delayorder: 0,
    delayorderDelivery: 0,
    takeaway_StopYesterday: false,
    delivery_StopYesterday: false,
    takeawaynightstart: "",
    takeawaynoonblock: "",
    takeawaynightblock: "",
    deliverynightstart: "",
    deliverynoonblock: "",
    deliverynightblock: "",
  });
  const products = useSelector((state: ProductItem[]) => state);

  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");

  const { bookingType, restoId, day, hour } = route.params;
  const date = moment.tz(
    day.substring(0, 10) + " " + hour,
    "America/Martinique"
  );
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
  async function onChangeTextEmail(email: any) {
    setEmail(email.trim().toLowerCase());
  }

  async function onChangeTextFirstname(firstname: any) {
    setFirstname(firstname);
  }
  async function onChangeTextCity(city: any) {
    setCity(city);
  }
  async function onChangeTextNotecom(notecom: any) {
    setNotecom(notecom);
  }

  async function onChangeTextZip(zip: any) {
    setZip(zip);
  }
  async function onChangeTextline1(line1: any) {
    setLine1(line1);
  }
  async function onChangeTextLastname(lastname: any) {
    setLastname(lastname);
  }
  async function onChangeTextPhone(phone: any) {
    setPhone(phone);
  }

  async function calculusTotalCashBasket() {
    let sumRaw = 0;
    products.map((product) => {
      sumRaw = sumRaw + product.quantity * product.amount;
    });
    setTotalCashBasket(sumRaw % 1 === 0? sumRaw : Math.round(sumRaw * 100) / 100);
  }

  async function getReservation() {
    let params = {
      date: moment.tz(day, "America/Martinique").toDate(),
      itid: intcust.id,
    };
    const resas = await Parse.Cloud.run("getReservationsSafeByDate", params);
    return await resas.filter((x: any) => x.attributes.status);
  }

  async function testOrderDaily_Stop() {
    let isValid = true;
    if ([TAKEAWAY, DELIVERY].includes(bookingType)) {
      if (
        (bookingType === TAKEAWAY && intcust.orderDaily_StopTaway === 0) ||
        (bookingType === DELIVERY && intcust.orderDaily_StopDelivery === 0)
      )
        isValid = false;
      else {
        const resasClean = await getReservation();
        if (
          (resasClean.length > 0 &&
            bookingType === TAKEAWAY &&
            intcust.orderDaily_StopTaway ===
              resasClean.filter(
                (x: any) => x.attributes.engagModeResa === bookingType
              ).length) ||
          (bookingType === DELIVERY &&
            intcust.orderDaily_StopDelivery ===
              resasClean.filter(
                (x: any) => x.attributes.engagModeResa === bookingType
              ).length)
        )
          isValid = false;
      }
    }
    return isValid;
  }

  async function testOrderCren_Stop() {
    let isValid = true;
    if (
      [TAKEAWAY, DELIVERY].includes(bookingType) &&
      intcust.confirmModeOrderOptions_shiftinterval > 0
    ) {
      const resasClean = await getReservation();
      if (
        resasClean.length > 0 &&
        (bookingType === DELIVERY
          ? intcust.orderCren_StopDelivery
          : intcust.orderCren_StopTaway) ===
          resasClean.filter((x: any) => {
            let isBetweenInterval = false;
            const h = parseInt(hour.substring(0, 2)),
              m = parseInt(hour.substring(3)),
              resaH = moment.tz(x.attributes.date, "America/Martinique").hour(),
              resaM = moment
                .tz(x.attributes.date, "America/Martinique")
                .minute(),
              min =
                m < intcust.confirmModeOrderOptions_shiftinterval ||
                intcust.confirmModeOrderOptions_shiftinterval === 60
                  ? 0
                  : intcust.confirmModeOrderOptions_shiftinterval,
              max =
                min + intcust.confirmModeOrderOptions_shiftinterval < 60
                  ? min + intcust.confirmModeOrderOptions_shiftinterval
                  : 60;

            isBetweenInterval = h === resaH && min <= resaM && max >= resaM;

            return (
              x.attributes.engagModeResa === bookingType && isBetweenInterval
            );
          }).length
      )
        isValid = false;
    }
    return isValid;
  }

  async function testDelayCren_Stop() {
    let isValid = true;
    const delay =
      bookingType === DELIVERY
        ? intcust.delayorderDelivery
        : intcust.confirmModeOrderOptions_delayorder;

    if ([TAKEAWAY, DELIVERY].includes(bookingType) && delay > 0) {
      if (
        moment
          .tz(date, "America/Martinique")
          .diff(moment.tz("America/Martinique"), "minutes") < delay
      )
        isValid = false;
    }
    return isValid;
  }

  async function testNoonNight_Stop() {
    let isValid = true;
    const stopYesterday =
      bookingType === DELIVERY
        ? intcust.takeaway_StopYesterday
        : intcust.delivery_StopYesterday;
    if (date.isSame(moment.tz("America/Martinique"), "day")) {
      if ([TAKEAWAY, DELIVERY].includes(bookingType)) {
        if (stopYesterday) {
          isValid =
            date.diff(
              date
                .subtract(1, "days")
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            ) < 0;
        } else {
          const nightblock =
              bookingType === DELIVERY
                ? intcust.deliverynightblock
                : intcust.takeawaynightblock,
            nightstart =
              bookingType === DELIVERY
                ? intcust.deliverynightstart
                : intcust.takeawaynightstart,
            noonblock =
              bookingType === DELIVERY
                ? intcust.deliverynoonblock
                : intcust.takeawaynoonblock,
            dateNoonblock = moment.tz(
              day.substring(0, 10) + " " + noonblock,
              "America/Martinique"
            ),
            dateNightstart = moment.tz(
              day.substring(0, 10) + " " + nightstart,
              "America/Martinique"
            ),
            dateNightblock = moment.tz(
              day.substring(0, 10) + " " + nightblock,
              "America/Martinique"
            );

          isValid =
            moment.tz("America/Martinique").diff(dateNoonblock) < 0 ||
            (moment.tz("America/Martinique").diff(dateNightstart) > 0 &&
              moment.tz("America/Martinique").diff(dateNightblock) < 0);
        }
      }
    } else {
      isValid = true;
    }
    return isValid;
  }

  async function testQuantity() {
    let isValid = true;
    for (var product of products) {
      var Menu = Parse.Object.extend("Menu");
      let menu = new Menu();
      menu.id = product.id;
      await menu.fetch();
      const params = {
        itid: restoId,
        menuid: product.id,
        date: day,
      };
      const consumed = await Parse.Cloud.run("checkStock", params);
      if (menu.attributes.provisionStockBase.length > 0) {
        let provision = menu.attributes.provisionStockBase.filter((x: any) =>
          moment
            .tz(x.date, "America/Martinique")
            .isSame(moment.tz(x.date, "America/Martinique"), "day")
        );
        isValid = provision[0].provision > consumed + 1;
        if (!isValid) {
          Alert.alert(
            `Le stock est épuisé sur le produit ${product.name}. Vous pouvez retourner au panier pour le modifier.`
          );
          navigation.navigate("basketScreen", {
            restoId: intcust.id,
            bookingType: bookingType,
            day: day,
          });
          break;
        }
      }
    }
    return isValid;
  }

  async function goPay() {
    let blockGo = false;
    setLoading(true);

    if (
      email &&
      EmailValidator.validate(email) == true &&
      firstname &&
      lastname &&
      phone &&
      blockGo == false
    ) {
      // Tester si le nombre de commande à emporter pour une intervalle de temps < orderCren_Stop
      const testOC = await testOrderCren_Stop();
      let testOD = true,
        testDelayCren = true,
        testNoonNight = true,
        testQty = true;

      if (!testOC) {
        Alert.alert(
          "La limite de commande a été atteinte sur ce créneau horaire sur ce restaurant. Vous pouvez commander pour un autre créneau horaire."
        );
        navigation.navigate("RestoScreen", {
          restoId: intcust.id,
          bookingType: bookingType,
          day: day,
        });
      } else {
        // Tester si le nombre de commande à emporter < orderDaily_Stop
        testOD = await testOrderDaily_Stop();
        if (!testOD) {
          Alert.alert(
            "La limite de commande a été atteinte pour aujourd'hui sur ce restaurant. Il n'a plus de disponibilité. Vous pouvez commander pour un autre jour."
          );
          navigation.navigate("RestoScreen", {
            restoId: intcust.id,
            bookingType: bookingType,
            day: "null",
          });
        } else {
          testDelayCren = await testDelayCren_Stop();
          if (!testDelayCren) {
            Alert.alert(
              "Le créneau que vous avez sélectionné est maintenant trop proche pour permettre au restaurant d'être prêt."
            );
            navigation.navigate("RestoScreen", {
              restoId: intcust.id,
              bookingType: bookingType,
              day: "null",
            });
          } else {
            testNoonNight = await testNoonNight_Stop();
            if (!testNoonNight) {
              Alert.alert(
                "L’heure limite de commande du service est désormais dépassée. Vous pouvez commander pour un autre service ou un autre jour."
              );

              navigation.navigate("RestoScreen", {
                restoId: intcust.id,
              });
            } else {
              testQty = await testQuantity();
            }
          }
        }
      }

      if (testOC && testOD && testDelayCren && testNoonNight && testQty) {
        let params = {
          email: email,
          itid: intcust.id,
        };
        const res = await Parse.Cloud.run("getGuest", params);
        var Guest = Parse.Object.extend("Guest");
        let guestRaw = new Guest();
        if (res.length == 0) {
          guestRaw.set("firstname", firstname);
          guestRaw.set("lastname", lastname);
          guestRaw.set("email", email);
          await guestRaw.save();
        } else if (res.length > 0) {
          guestRaw.id = res[0].id;
        }

        var Reservation = Parse.Object.extend("Reservation");
        let resaRaw = new Reservation();
        resaRaw.set(
          "date",
          moment
            .tz(day, "America/Martinique")
            .hours(route.params.hour.substring(0, 2))
            .minute(route.params.hour.substring(3))
            .toDate()
        );
        resaRaw.set("guest", guestRaw);
        let arrayGuest = [
          {
            firstname: firstname,
            lastname: lastname,
            mobilephone: phone,
            email: email,
          },
        ];
        resaRaw.set("line_items", products);
        var Intcust = Parse.Object.extend("Intcust");
        let intcustRawY = new Intcust();
        intcustRawY.id = intcust.id;
        resaRaw.set("intcust", intcustRawY);
        resaRaw.set("guestFlat", arrayGuest);
        resaRaw.set("delifare", Number(delifare));
        resaRaw.set("order", true);
        resaRaw.set("notes", notecom);
        resaRaw.set("process", "appdisco");

        if (bookingType == "TakeAway") {
          let params2 = {
            itid: intcust.id,
          };
          const res3 = await Parse.Cloud.run("getTakeAwayAsSeating", params2);
          resaRaw.set("seating", res3[0]); // en cours
          let arraySeating = [
            {
              name: res3[0].attributes.name,
              type: res3[0].attributes.type,
              description: res3[0].attributes.description,
              capacity: res3[0].attributes.capacity,
            },
          ];
          resaRaw.set("seatingFlat", arraySeating);
        }

        if (bookingType == "Delivery") {
          let params2 = {
            itid: intcust.id,
          };
          const res3 = await Parse.Cloud.run("getDeliveryAsSeating", params2);
          resaRaw.set("seating", res3[0]); // en cours
          let arraySeating = [
            {
              name: res3[0].attributes.name,
              type: res3[0].attributes.type,
              description: res3[0].attributes.description,
              capacity: res3[0].attributes.capacity,
            },
          ];

          resaRaw.set("seatingFlat", arraySeating);

          let deliveryAdressRaw =[
            {
              "name": "adrress",
              "full": line1 + zip + city,
              "line1": line1,
              "zip": zip,
              "city": city,
              "latitude": 0,
              "longitude": 0,
              "note": ""
            }
          ]
          resaRaw.set("deliveryAdressFlat", deliveryAdressRaw);
        }
        resaRaw.set("status", "En cours"); // en cours
        resaRaw.set("engagModeResa", bookingType);
        resaRaw.set("delifare", Number(delifare));
        resaRaw.set("source", {
          utm_campaign: "APP",
          utm_medium: Platform.OS,
          utm_source: Platform.Version,
          utm_content: "APP",
        });

        await resaRaw.save();
        await setResa({
          id: resaRaw.id || "",
          engagModeResa: resaRaw.attributes.engagModeResa || "",
          guestFlat: resaRaw.attributes.guestFlat || [],
        });

        if (intcust.paymentChoice !== "stripeOptin") {
          const params1 = {
            itid: intcust.id,
            winl: "window.location.host",
            resaid: resaRaw.id,
            customeremail: email,
            customerfirstname: firstname,
            customerlastname: lastname,
            customerphone: phone,
            type: "order",
            amount: totalCashBasket + Number(delifare),
            apikeypp: intcust.apikeypp,
            mode: bookingType,
            noukarive: intcust.option_DeliveryByNoukarive,
            toutalivrer: intcust.option_DeliveryByToutAlivrer,
          };

          const response = await Parse.Cloud.run(
            "getPayPlugPaymentUrlRN",
            params1
          );

          // navigate and options payLink
          navigation.navigate("paymentScreen", {
            restoId: restoId,
            paylink: response,
            bookingType: bookingType,
            resaId: resaRaw.id,
            day: day,
            hour: hour,
            amount: totalCashBasket + Number(delifare),
          });
        } else if (intcust.paymentChoice == "stripeOptin") {
          let sumRaw = 0;
          products.map((product) => {
            sumRaw = sumRaw + product.quantity * product.amount;
          });

          let params = {
            stripeAccount: intcust.stripeAccId,
            amount: sumRaw + Number(delifare),
            customeremail: email,
            name: firstname + lastname,
            resaid: resaRaw.id,
            mode: bookingType,
            paidType: "order",
            noukarive: intcust.option_DeliveryByNoukarive,
            toutalivrer: intcust.option_DeliveryByToutAlivrer,
          };

          const {
            paymentIntent,
            ephemeralKey,
            customer,
          } = await Parse.Cloud.run("stripeCheckoutForRN", params);

          let ERR = {};

          ERR = await initPaymentSheet({
            merchantDisplayName: intcust.corporation,
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
          });

          if (!ERR) {
            setLoading(true);
          }

          let clientSecret = paymentIntent;
          const { error } = await presentPaymentSheet({
            clientSecret,
          });

          if (error) {
            if (error.code == "Canceled") {
              Alert.alert("Paiement annulé");
            } else {
              Alert.alert(`Error code: ${error.code}`, error.message);
            }
          } else {
            Alert.alert("Paiement réussi.");
            navigation.navigate("successScreen", {
              bookingType: bookingType,
              resaId: resaRaw.id,
              day: day,
              hour: hour,
              amount: totalCashBasket + Number(delifare),
            });
          }
          setPaymentSheetEnabled(false);
          setLoading(false);
        }
      }
    } else if (!email || EmailValidator.validate(email) == false) {
      Alert.alert(
        "Merci de vérifier votre adresse email. Le format est incorrect."
      );
    } else {
      alert("Merci de saisir tous les champs. ");
    }
  }

  useEffect(() => {
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = restoId;
    setIntcustCityChoice(intcustRaw.attributes.citiesChoice2);
    setCity(intcustRaw.attributes.citiesChoice2[0].city);
    setDelifare(intcustRaw.attributes.citiesChoice2[0].tar);

    let intcustRawX = [
      {
        id: intcustRaw.id,
        apikeypp: intcustRaw.attributes.apikeypp || "",
        paymentChoice: intcustRaw.attributes.paymentChoice || "",
        option_DeliveryByNoukarive:
          intcustRaw.attributes.option_DeliveryByNoukarive || false,
        option_DeliveryByToutAlivrer:
          intcustRaw.attributes.option_DeliveryByToutAlivrer || false,
        stripeAccId: intcustRaw.attributes.stripeAccId || "",
        orderDaily_StopTaway: intcustRaw.attributes.orderDaily_StopTaway || 0,
        orderCren_StopTaway: intcustRaw.attributes.orderCren_StopTaway || 0,
        confirmModeOrderOptions_shiftinterval:
          intcustRaw.attributes.confirmModeOrderOptions_shiftinterval || 0,
        orderDaily_StopDelivery:
          intcustRaw.attributes.orderDaily_StopDelivery || 0,
        orderCren_StopDelivery:
          intcustRaw.attributes.orderCren_StopDelivery || 0,
        confirmModeOrderOptions_delayorder:
          intcustRaw.attributes.confirmModeOrderOptions_delayorder || 0,
        delayorderDelivery: intcustRaw.attributes.delayorderDelivery || 0,
        takeaway_StopYesterday:
          intcustRaw.attributes.takeaway_StopYesterday || false,
        delivery_StopYesterday:
          intcustRaw.attributes.delivery_StopYesterday || false,
        takeawaynightstart: intcustRaw.attributes.takeawaynightstart || "",
        takeawaynoonblock: intcustRaw.attributes.takeawaynoonblock || "",
        takeawaynightblock: intcustRaw.attributes.takeawaynightblock || "",
        deliverynightstart: intcustRaw.attributes.deliverynightstart || "",
        deliverynoonblock: intcustRaw.attributes.deliverynoonblock || "",
        deliverynightblock: intcustRaw.attributes.deliverynightblock || "",
        corporation: intcustRaw.attributes.corporation || "",
      },
    ];
    setIntcust(intcustRawX[0]);
    calculusTotalCashBasket();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.label}>Votre adresse email</Text>
          <TextInput
            style={{
              color: textColor,
              fontFamily: "geometria-regular",
              height: 50,
              marginHorizontal: 20,
              marginTop: 4,
              paddingLeft: 20,
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 15,
              borderColor: "grey",
            }}
            onChangeText={onChangeTextEmail}
            placeholder="addresse@email.com"
            value={email}
          />
          <Text style={styles.label}>Votre prénom</Text>

          <TextInput
            style={{
              color: textColor,
              fontFamily: "geometria-regular",
              height: 50,
              marginHorizontal: 20,
              marginTop: 4,
              paddingLeft: 20,
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 15,
              borderColor: "grey",
            }}
            onChangeText={onChangeTextFirstname}
            placeholder="Gustavo"
            value={firstname}
          />

          <Text style={styles.label}>Votre nom de famille</Text>

          <TextInput
            style={{
              color: textColor,
              fontFamily: "geometria-regular",
              height: 50,
              marginHorizontal: 20,
              marginTop: 4,
              paddingLeft: 20,
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 15,
              borderColor: "grey",
            }}
            onChangeText={onChangeTextLastname}
            placeholder="Martin"
            value={lastname}
          />

          <Text style={styles.label}>
            Votre numéro de portable sans indicatif
          </Text>

          <TextInput
            style={{
              color: textColor,
              fontFamily: "geometria-regular",
              height: 50,
              marginHorizontal: 20,
              marginTop: 4,
              paddingLeft: 20,
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 15,
              borderColor: "grey",
            }}
            onChangeText={onChangeTextPhone}
            placeholder="069X 00 00 00"
            value={phone}
          />

          {bookingType == "Delivery" && (
            <View>
              <Text style={styles.label}>
                L'adresse à laquelle vous souhaitez être livré
              </Text>

              <TextInput
                style={{
                  color: textColor,
                  fontFamily: "geometria-regular",
                  height: 50,
                  marginHorizontal: 20,
                  marginTop: 4,
                  paddingLeft: 20,
                  borderWidth: 1,
                  borderRadius: 10,
                  fontSize: 15,
                  borderColor: "grey",
                }}
                onChangeText={onChangeTextline1}
                placeholder="5 rue des accacias"
                value={line1}
              />

              <Text style={styles.label}>Code Postal</Text>

              <TextInput
                style={{
                  color: textColor,
                  fontFamily: "geometria-regular",
                  height: 50,
                  marginHorizontal: 20,
                  marginTop: 4,
                  paddingLeft: 20,
                  borderWidth: 1,
                  borderRadius: 10,
                  fontSize: 15,
                  borderColor: "grey",
                }}
                onChangeText={onChangeTextZip}
                placeholder="97200"
                value={zip}
              />

              <Text style={styles.label}>
                Choisir une ville / zone de livraison
              </Text>

              {intcustCityChoice &&
                intcustCityChoice.map((item: any, index8: any) => (
                  <View
                    key={item.city + "view"}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginHorizontal: 30,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      key={item.city + "text"}
                      style={{ fontFamily: "geometria-regular" }}
                    >
                      {item.city}{" "}
                      {item.tar && item.tar > 0 && "+" + item.tar + "€"}
                    </Text>
                    <RadioButton
                      key={item.city + "radio"}
                      onPress={() => {
                        setCity(item.city);
                        setDelifare(Number(item.tar));
                      }}
                      color="#ff5050"
                      status={city === item.city? "checked" : "unchecked"}
                      value={city}
                      style={{ marginRight: 80 }}
                    />
                  </View>
                ))}
            </View>
          )}

          <Text style={styles.label}>
            Note / Commentaire sur votre commande
          </Text>

          <TextInput
            style={{
              color: textColor,
              fontFamily: "geometria-regular",
              height: 50,
              marginHorizontal: 20,
              marginTop: 4,
              paddingLeft: 20,
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 15,
              borderColor: "grey",
            }}
            onChangeText={onChangeTextNotecom}
            placeholder="Fort-de-france"
            value={notecom}
          />

          <TouchableOpacity
            onPress={() => goPay()}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>
              {" "}
              <Text style={styles.payText}>Valider et payer</Text>{" "}
            </Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#F50F50" />}
          {intcust && intcust.paymentChoice == "stripeOptin" && (
            <Text style={styles.appButtonText}>
              {" "}
              Avec <FontAwesome5
                name="cc-stripe"
                size={24}
                color={textColor}
              />{" "}
            </Text>
          )}
          {intcust && intcust.paymentChoice !== "stripeOptin" && (
            <Text style={styles.appButtonText}>
              {" "}
              Avec{" "}
              <Image
                source={require("../assets/images/pplogo.png")}
                fadeDuration={0}
                style={{ width: 90, height: 50 }}
              />
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.listitem}
          onPress={() => {
            navigation.navigate("termsScreen", {
              restoId: restoId,
              bookingType: bookingType,
            });
          }}
        >
          <Text style={styles.text}>En continuant j'accepte les CGU 👀➡️ </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    marginHorizontal: 20,
    fontFamily: "geometria-regular",
    marginTop: 20,
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    marginTop: 4,
    paddingLeft: 20,
    borderWidth: 1,
    fontFamily: "geometria-regular",
    borderRadius: 10,
    fontSize: 15,
    borderColor: "grey",
  },
  inputContainer: {
    marginTop: 4,
    borderBottomWidth: 0,
  },
  container: {
    flex: 1,
  },
  container2: {
    //    paddingTop : 30
  },
  payText: {
    alignSelf: "center",
    color: "white",
  },
  listitem: {
    padding: 5,
    alignItems: "center",
  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 10,
    marginTop: 30,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 20,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  appButtonText: {
    alignContent: "space-between",
    display: "flex",
    fontSize: 18,
    //  color: "#fff",
    //  fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  minitext: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1,
  },

  title: {
    //  flex:1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 20,
    fontFamily: "geometria-bold",
    // fontWeight: "bold",
  },
  textBold: {
    flex: 1,
    fontSize: 16,
    top: 0,
    fontFamily: "geometria-bold",
    //   fontWeight: "bold",
    padding: 20,
  },
  textRaw: {
    flex: 1,
    fontSize: 16,
    top: 0,
    fontFamily: "geometria-regular",
  },
  text: {
    // flex:1,
    fontSize: 16,
    top: 0,
    margin: "auto",
    fontFamily: "geometria-regular",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default custInfoScreen;
