import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Route,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert
} from "react-native";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { ScrollView } from "react-native-gesture-handler";
import HTML from "react-native-render-html";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NumericInput from "react-native-numeric-input";
import { useStripe } from "@stripe/stripe-react-native";
import * as EmailValidator from "email-validator";
import RadioItem from "../components/RadioItem";
import { LineItem, LineItemCollapse } from "../components/LineItemsComponent";

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;
interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}
interface IEvent {
  id: string;
  imageUrl: any;
  title: string;
  content: string;
  date: string;
  time: string;
  restaurant: string;
  price: number;
  infoline: string,
  freeconfirm: boolean,
  alacarte: boolean,
  menu: any[],
  itid: string,
  seatleft: number,
  onsiteOptin: boolean,
  takeAwayOptin: boolean,
  deliveryOptin: boolean
}

export const EventScreen = ({ route, navigation }: Props) => {
  const [html, setHtml] = useState()
  const [event, setEvent] = useState<IEvent>();
  const [resaid, setResaId] = useState(null)
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [crenModalVisible, setCrenModalVisible] = useState(false);
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [noteCommande, setNoteCommande] = useState('')
  const [numcover, setNumcover] = useState(1)
  const [loading, setLoading] = useState(false);
  const [isResaConfirmed, setIsResaConfirmed] = useState(false)
  const [paymentchoice, setPaychoice] = useState(null);

  const [mode, setMode] = useState<string>();
  const [total, setTotal] = useState<number>(0);
  const [enabledModes, setEnabledModes] = useState<string[]>();
  const [expanded, setExpanded] = useState<number>(-1);
  const [selectedPricevarIndexes, setSelectedPricevarIndexes] = useState<{id: string, index: number}[]>([]);
  const [lineitems, setLineitems] = useState<any[]>([]);
  
  const [keyboard, setKeyboard] = useState(0)
  const [offset, setOffset] = useState(0)

  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");
  const tagsStyles = {
    p: { fontFamily: "geometria-regular", fontSize: 18, color: textColor },
    li: { fontFamily: "geometria-regular", fontSize: 18, color: textColor },

  };

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
  async function prepareFetch() {
    var Event = Parse.Object.extend("Event");
    let eventRaw = new Event();
    eventRaw.id = route.params.eventId;
    setHtml(eventRaw.attributes.description)
    setEvent({
      id: eventRaw.id || "",
      imageUrl: eventRaw?.attributes.image?._url || "",
      content: eventRaw.attributes.description || " a",
      title: eventRaw.attributes.title || "",
      date: moment(eventRaw.attributes.date).format("dddd DD MMM") || "",
      time: moment(eventRaw.attributes.date).format("HH:mm") || "",
      restaurant: eventRaw.attributes.intcust.attributes.corporation || "",
      price: eventRaw.attributes.price || "",
      infoline: eventRaw.attributes.infoline || "",
      freeconfirm: eventRaw.attributes.freeconfirm || null,
      seatleft: eventRaw.attributes.seatleft || 0,
      itid: eventRaw.attributes.intcust.id || true,
      menu: eventRaw.attributes.menu || [],
      alacarte: eventRaw.attributes.alacarte,
      onsiteOptin: eventRaw.attributes.onsiteOptin,
      takeAwayOptin: eventRaw.attributes.takeAwayOptin,
      deliveryOptin: eventRaw.attributes.deliveryOptin
    });
    //console.log(JSON.stringify(eventRaw.attributes.menu))
    if(eventRaw.attributes.menu && eventRaw.attributes.menu.length > 0)
    setLineitems(eventRaw.attributes.menu)
    const modes : any = { SurPlace: eventRaw.attributes.onsiteOptin, TakeAway : eventRaw.attributes.takeAwayOptin, Delivery: eventRaw.attributes.deliveryOptin }
    const newEnabledModes = Object.keys(modes).filter((key:string) => modes[key])
    setEnabledModes(newEnabledModes)
    if(newEnabledModes.length === 1)
      setMode(newEnabledModes[0])
    var Intcust = Parse.Object.extend("Intcust")
    let IntcustRaw = new Intcust()
    IntcustRaw.id = eventRaw.attributes.intcust.id
    await IntcustRaw.fetch()
    setPaychoice(IntcustRaw.attributes.paymentChoice)
  }
  useEffect(() => {
    calculusSumAll();
  }, [lineitems]);

  useEffect(() => {
    prepareFetch()
    const k1 = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboard(e.endCoordinates.height)
    })
    const k2 = Keyboard.addListener('keyboardDidHide', () => { setKeyboard(0); setOffset(0) })
    return () => {
      k1.remove()
      k2.remove()
    }
  }, [])

  const reset = () => {
    setFirstname('')
    setLastname('')
    setPhone('')
    setEmail('')
  }

  const calculusSumAll = () => {
    let sumOfsavePersoDataSums = 0;
    let sumOfFormulaSupSums = 0;
    let tot = 0;
    const filteredLineitems = lineitems? lineitems.filter((line) => line.quantity > 0) : []
    if (filteredLineitems.length > 0) {
      tot = filteredLineitems.reduce(
        (accumulateur, valeurCourante) => {
          let amount = parseFloat(valeurCourante.amount)
          if(valeurCourante.pricevarcheck && valeurCourante.pricevars && valeurCourante.pricevars.length > 0){
            const index = selectedPricevarIndexes.length > 0? selectedPricevarIndexes.findIndex((selectedPricevar: any) => selectedPricevar.id === valeurCourante.id) : -1
            if(index === -1)
              Alert.alert('Erreur', 'Veuillez sélectionner une variation pour '+ valeurCourante.name)
            else { 
              const pricevar = valeurCourante.pricevars[selectedPricevarIndexes[index].index]
              amount = mode? (mode === 'Delivery'? parseFloat(pricevar.pricevardelivery) : mode === 'TakeAway'? parseFloat(pricevar.pricevartakeaway) : mode === 'SurPlace'? parseFloat(pricevar.pricevaronsite) : 0 ) : 0
            }
          }
          return accumulateur + parseInt(valeurCourante.quantity) * amount
        },
        0
      );

      filteredLineitems.map((line) => {
        if (line.persoData) {
          line.persoData.map((perso: any) => {
            sumOfsavePersoDataSums =
            sumOfsavePersoDataSums + (perso.allPersoSum || 0);
          });
        }

        if (line.formulaChoiced) {
          line.formulaChoiced.map((fc: any) => {
            fc.menus.map((menu: any) => {
              if(menu.price){
                sumOfFormulaSupSums =
                sumOfFormulaSupSums + menu.price * line.quantity;
              }

            });
          });
        }
      });

      tot = tot + (sumOfsavePersoDataSums + sumOfFormulaSupSums);
    }
    setTotal(tot);
  }

  const checkMessFormula = (index: number) => {
    let textCheckFormulas: string[] = []
    let line = lineitems[index]
    if(line.formulaChoice?.length > 0)
      line.formulaChoice.forEach((fc: any) => {
        const sum =
          fc.menus.reduce(
            (a: any, b: any) => (a.numChoiced || 0) + (b.numChoiced || 0)
          );
        if ((typeof sum === 'object'? sum.numChoiced : sum) != fc.numExact ) {
          textCheckFormulas.push(`Merci de saisir le nombre indiqué ${fc.numExact} pour : ` + fc.cattitle)   
        }
      })
    return textCheckFormulas
  }

  const checkMessPerso = (index: number) => {
    let textCheckPersos: string[] = []
    let line = lineitems[index]
    if(line.persoData?.length > 0)
      line.persoData.forEach((pd: any) => {
        if (pd.mandatory && pd.values.filter((value: any) => value.checked).length === 0) {
          textCheckPersos.push(`Merci de saisir le nombre indiqué pour : ` + pd.name)   
        }
      })
    return textCheckPersos
  }

  async function deleteFromLines(index: number) {
    let newLineitems = lineitems.filter((obj, i) => i !== index);
    setLineitems(Object.assign([], newLineitems));
  }

  async function addQuantityFromLines(index: number) {
    let newLineitems = lineitems;
    let newQuantity = (newLineitems[index].quantity || 0) + 1
    newLineitems[index] = {
      ...newLineitems[index],
      quantity: newQuantity,
      persoData: !newLineitems[index].persoData? [] : newLineitems[index].persoData.map((perso: any) => {
        return {
          ...perso,
          allPersoSum: !perso.values? 0 : perso.values.reduce(
            (accumulateur: any, valeurCourante: any) => accumulateur + (newQuantity * parseFloat(valeurCourante.price || 0)),
            0
          ),
          values: !perso.values? [] : perso.values.map((value: any) => {
            return {
              ...value,
              number: newQuantity
            }
          })
        }
      })
    };
    setLineitems(Object.assign([], newLineitems));
  }

  async function removeQuantityFromLines(index: number) {
    let newLineitems = lineitems;
    if (lineitems[index].quantity > 0){
      let newQuantity = newLineitems[index].quantity - 1
      newLineitems[index] = {
        ...newLineitems[index],
        quantity: newQuantity,
        persoData: !newLineitems[index].persoData? [] : newLineitems[index].persoData.map((perso: any) => {
          return {
            ...perso,
            allPersoSum: !perso.values? 0 : perso.values.reduce(
              (accumulateur: any, valeurCourante: any) => accumulateur + (newQuantity * parseFloat(valeurCourante.price || 0)),
              0
            ),
            values: !perso.values? [] : perso.values.map((value: any) => {
              return {
                ...value,
                number: newQuantity
              }
            })
          }
        })
      };
    }
    setLineitems(Object.assign([], newLineitems));
  }

  const addFormulaMenuChoice = (index: number, i: number, j:number) => {
    const numExact = lineitems[index].formulaChoice[i].numExact;
    const sum =
      lineitems[index].formulaChoice[i].menus.reduce(
        (a: any, b: any) => (a.numChoiced || 0) + (b.numChoiced || 0)
      );
      if ((typeof sum === 'object'? sum.numChoiced : sum) + 1 > numExact) {
        Alert.alert("Erreur", "Désolé : " + numExact + " maximum.");
      return;
    }
    const newLineitem = {
      ...lineitems[index],
      formulaChoice: lineitems[index].formulaChoice.map((cat: any, ii: number) => {
        if (ii === i)
          return {
            ...cat,
            menus: cat.menus.map((menu: any, jj: number) => {
              if (jj === j)
                return {
                  ...menu,
                  numChoiced: (menu.numChoiced || 0) + 1,
                };
              else return menu;
            }),
          };
        else return cat;
      })
    };

    let newLineitems = lineitems;
    newLineitems[index] = newLineitem;
    setLineitems(Object.assign([], newLineitems));
   
  };

  const removeFormulaMenuChoice = (index: number, i: number, j: number) => {
    const newLineitem = {
      ...lineitems[index],
      formulaChoice: lineitems[index].formulaChoice.map((cat: any, ii: number) => {
        if (ii === i)
          return {
            ...cat,
            menus: cat.menus.map((menu: any, jj: number) => {
              if (jj === j)
                return {
                  ...menu,
                  numChoiced: menu.numChoiced > 1 ? menu.numChoiced - 1 : 0,
                };
              else return menu;
            }),
          };
        else return cat;
      }),
    };
    let newLineitems = lineitems;
    newLineitems[index] = newLineitem;
    setLineitems(Object.assign([], newLineitems));
  };

  const savePerso = (mandatory: boolean, checked: boolean, value: any, price: any, maxFree: number, maxPaid: number, name: string, lineitems: any) => {
    let quant = lineitems[expanded].quantity || 0
    let savePersoData = lineitems[expanded].persoData
    let objIndex = savePersoData.findIndex((obj: any) => obj.name == name);
    
    let newLineitem = lineitems[expanded]
    let newLineitems = lineitems

    newLineitem = {
      ...newLineitem,
      persoData: newLineitem.persoData?.map((perso: any, i: number) => {
        if(i === objIndex)
          return {
            ...perso,
            choicestring: checked? (perso.choicestring || "") + " " + value : perso.choicestring?.replace(value, ""),
            allPersoSum: (perso.allPersoSum || 0) + price * quant * (checked? 1 : -1),
            numChecked: (perso.numChecked || 0) + (checked? 1 : -1),
            numCheckedFree: perso.values.filter((val: any) => val.value === value)[0].price === 0? (perso.numCheckedFree || 0) + (checked? 1 : -1) : perso.numCheckedFree,
            numCheckedPaid: perso.values.filter((val: any) => val.value === value)[0].price > 0? (perso.numCheckedPaid || 0) + (checked? 1 : -1) : perso.numCheckedPaid,
            values: perso.values.map((val: any) => {
              if(val.value === value)
                return {
                  ...val,
                  number: quant,
                  sumval: val.price * quant,
                  checked
                }
              else return val
            })
          }
        else return perso
      })
    }
    
    newLineitems[expanded] = newLineitem
    return newLineitems
  }

  const updatePersoNumChecked = (index: number, i: number, j: number) => {
    let alreadyblocked = false
    const currentPersoData = lineitems[index].persoData[i]
    if (currentPersoData.values[j].price === 0 && (currentPersoData.numCheckedFree || 0) === currentPersoData.maxFree && alreadyblocked === false) {
      Alert.alert("Erreur", "Désolé : " + currentPersoData.max + " gratuit maximum.");        
      alreadyblocked = true;
    }

    if (currentPersoData.values[j].price > 0 && (currentPersoData.numCheckedPaid || 0) === currentPersoData.maxPaid && alreadyblocked === false) {
      Alert.alert("Erreur", "Désolé : " + currentPersoData.maxpaid + " maximum.");
      alreadyblocked = true;
    }

    if(!alreadyblocked){
      const newLineitem = {
        ...lineitems[index],
        persoData: lineitems[index].persoData.map((perso: any, ii: number) => {
          if (ii === i)
            return {
              ...perso,
              values: perso.values.map((value: any, jj: number) => {
                if (jj === j)
                  return {
                    ...value,
                    checked: !value.checked,
                  };
                else return value;
              }),
            };
          else return perso;
        }),
      };
      let newLineitems = lineitems;
      newLineitems[index] = newLineitem;
      const checked = newLineitem.persoData[i]
      newLineitems = savePerso(checked.mandatory, checked.values[j].checked, checked.values[j].value, checked.values[j].price,checked.max,checked.maxpaid,checked.name, newLineitems)
      // addtoBasket(lineitems[index].id,"formule")
      setLineitems(Object.assign([], newLineitems));
    }
  };
  
  return (
    <View style={styles.container}>
      <Modal
        isVisible={crenModalVisible}
        onModalHide={reset}
        onSwipeComplete={(e) => setCrenModalVisible(false)}
        onBackButtonPress={() => setCrenModalVisible(false)}
        onBackdropPress={() => setCrenModalVisible(false)}
        style={{
          padding: 0,
          margin: 0,
          ...(Platform.OS !== "android" && {
            zIndex: 10,
          }),
          backgroundColor: backgroundColor,
          position: 'absolute',
          bottom: offset > 0 && keyboard > 0 ? keyboard - offset : 0,
          width: '100%',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          height: 530
        }}
      >
        <View
          style={{
            backgroundColor: backgroundColor,
            padding: 20,
            borderRadius: 10,
            elevation: 10,
            ...(Platform.OS !== "android" && {
              zIndex: 100,
            })
          }}
        >

          {
            !isResaConfirmed &&
            <>
              {
                event?.freeconfirm &&
                <Text style={{ fontFamily: 'geometria-bold', marginBottom: 10 }}>
                  Reservez gratuitement
                </Text>
              }
              {
                (event?.freeconfirm && !event?.alacarte) &&
                <>
                  <Text style={{ fontFamily: 'geometria-regular' }}>
                    Nombre de convives
                  </Text>
                  <NumericInput
                    onLimitReached={(isMax, msg) => Alert.alert("Vous avez atteint la limite de places restantes.")}
                    value={numcover}
                    textColor={textColor}
                    minValue={1}
                    maxValue={event?.seatleft}
                    containerStyle={{ marginLeft: 20, marginTop: 10 }}
                    onChange={(value) => setNumcover(value)}
                  />
                </>
              }
              <Text style={{ fontFamily: 'geometria-regular' }}>
                Email
              </Text>
              <TextInput
                onFocus={() => setOffset(400)}
                style={[styles.textInput, { color: textColor, fontFamily: "geometria-regular" }]}
                value={email}
                onChangeText={text => setEmail(text.toLocaleLowerCase())}
              />
              <Text style={{ fontFamily: 'geometria-regular' }}>
                Prénom(s)
              </Text>
              <TextInput
                onFocus={() => setOffset(325)}
                style={[styles.textInput, { color: textColor, fontFamily: "geometria-regular" }]}
                value={firstname}
                onChangeText={text => setFirstname(text)}
              />
              <Text style={{ fontFamily: 'geometria-regular' }}>
                Nom de famille
              </Text>
              <TextInput
                onFocus={() => setOffset(225)}
                style={[styles.textInput, { color: textColor, fontFamily: "geometria-regular" }]}
                value={lastname}
                onChangeText={text => setLastname(text)}
              />
              <Text style={{ fontFamily: 'geometria-regular' }}>
                Numéro de téléphone portable
              </Text>
              <TextInput
                onFocus={() => setOffset(155)}
                style={[styles.textInput, { color: textColor, fontFamily: "geometria-regular" }]}
                value={phone}
                onChangeText={text => setPhone(text)}
              />
              <Text style={{ fontFamily: 'geometria-regular' }}>
                Note de commande
              </Text>
              <TextInput
                onFocus={() => setOffset(80)}
                style={[styles.textInput, { color: textColor, fontFamily: "geometria-regular" }]}
                value={noteCommande}
                onChangeText={text => setNoteCommande(text)}
              />
              {event?.freeconfirm !== true &&
                <Text style={{ fontFamily: 'geometria-regular', marginTop: 20 }}>
                  Vous allez être redirigé vers la page de paiement {paymentchoice == "stripeOptin" ? "Stripe" : "Payplug"} pour régler : {numcover * ((event?.price || 0) + total)}€TTC
                </Text>
              }
            </>
          }
          {
            isResaConfirmed &&
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="check-circle-outline" size={150} color='rgb(0, 209, 73)' />
              <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 18 }}>Réservation confirmée</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 10, color: '#ff5050' }}>Numéro de réservation</Text>
              <Text style={{ fontWeight: 'bold', color: '#ff5050' }}>{resaid}</Text>
              <Text>Notez-le et conservez-le</Text>
            </View>
          }
        </View>
        <TouchableOpacity
          onPress={async () => {
            if (EmailValidator.validate(email) == false) {
              Alert.alert("Vérifiez le format de votre adresse email.")
            }

            if (isResaConfirmed) {
              navigation.navigate('TablesScreen')
              setCrenModalVisible(false)
            }
            else if (!isResaConfirmed && EmailValidator.validate(email) == true) {
              // TO DO
              // payant ou gratuit 
              var Reservation = Parse.Object.extend("Reservation")
              let reservationRaw = new Reservation()
              var Event = Parse.Object.extend("Event")
              let eventRaw = new Event()
              eventRaw.id = route.params.eventId
              var Intcust = Parse.Object.extend("Intcust")
              let IntcustRaw = new Intcust()
              IntcustRaw.id = event?.itid
              await IntcustRaw.fetch()
              let params = {
                email: email,
                itid: IntcustRaw.id,
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
              let arrayGuest = [
                {
                  firstname: firstname,
                  lastname: lastname,
                  mobilephone: phone,
                  email: email,
                },
              ];
              reservationRaw.set("guest", guestRaw)
              reservationRaw.set("guestFlat", arrayGuest)
              reservationRaw.set("event", eventRaw)
              reservationRaw.set("intcust", IntcustRaw)
              reservationRaw.set("line_items", lineitems? lineitems.filter((line) => line.quantity > 0).map((line) => {
                let amount = parseFloat(line.amount)
                let pricevar
                if(line.pricevarcheck && line.pricevars && line.pricevars.length > 0){
                  const index = selectedPricevarIndexes.length > 0? selectedPricevarIndexes.findIndex((selectedPricevar: any) => selectedPricevar.id === line.id) : -1
                  if(index === -1)
                    Alert.alert('Erreur', 'Veuillez sélectionner une variation pour '+ line.name)
                  else { 
                    pricevar = line.pricevars[selectedPricevarIndexes[index].index]
                    amount = mode? (mode === 'Delivery'? parseFloat(pricevar.pricevardelivery) : mode === 'TakeAway'? parseFloat(pricevar.pricevartakeaway) : mode === 'SurPlace'? parseFloat(pricevar.pricevaronsite) : 0 ) : 0
                  }
                }
                return {
                  id: line.id,
                  name: line.name,
                  description: line.description,
                  amount,
                  pricevar: pricevar && pricevar.name,
                  taxrate: (line.tva && line.tva.rate)? line.tva.rate : 0,
                  taxname: (line.tva && line.tva.name)? line.tva.name : 'Non spécifié',
                  userId: 'selfcare',
                  createdAt: moment.tz("America/Martinique").format('DD/MM/YYYY HH:mm'),
                  typeProcess: "VENTE",
                  currency: 'eur',
                  formulaChoiced: line.formulaChoiced,
                  persoData: line.persoData
                }
              }) : [])
              reservationRaw.set("OnWaitingList", false)
              reservationRaw.set("engagModeResa", "Event")
              await reservationRaw.save()
              if (event?.freeconfirm == true) {
                let params = {
                  myresid: reservationRaw.id,
                  firstname: firstname,
                  lastname: lastname,
                  email: email,
                  phone: phone,
                  itid: event.itid,
                  note: "",
                  agreed: true,
                  numguest: numcover
                };
                const res = await Parse.Cloud.run("editRes4FreeDisco", params);

                setResaId(res.id)
                setIsResaConfirmed(true)
                const params40 = {
                  itid: event.itid
                };
                const employeesOfIntcust = await Parse.Cloud.run("getEmployees", params40);
                employeesOfIntcust.map(async (user: any) => {
                  const params50 = {
                    employeeId: user.id,
                  };
                  const installationsOfEmployee = await Parse.Cloud.run("getInstallationsOfEmployees", params50);
                  installationsOfEmployee.map((installation: any) => {
                    const params10 = {
                      token: installation.attributes.deviceToken,
                      title: 'Vous avez une nouvelle réservation sur TABLE',
                      body: 'Au nom de ' + firstname + ' ' + lastname + ', ' + numcover + ' couverts pour votre évènement ' + event.title + '. Faites chauffer les casseroles !',
                    };
                    Parse.Cloud.run("sendPush", params10);
                  })
                })
              } else {
                // si payant go to payment payplug ou stripe 
                if (IntcustRaw.attributes.paymentChoice !== "stripeOptin") {
                  const params1 = {
                    itid: IntcustRaw.id,
                    winl: "www.tablebig.com",
                    resaid: reservationRaw.id,
                    customeremail: email,
                    customerfirstname: firstname,
                    customerlastname: lastname,
                    customerphone: phone,
                    type: "order",
                    amount: ((event?.price || 0) + total) * numcover,
                    apikeypp: IntcustRaw.attributes.apikeypp,
                    mode: 'Event',
                    noukarive: false,
                    toutalivrer: false
                  };
                  const response = await Parse.Cloud.run(
                    "getPayPlugPaymentUrlRN",
                    params1
                  );
                  setCrenModalVisible(false)

                  // navigate and options payLink
                  navigation.navigate("paymentScreen", {
                    restoId: IntcustRaw.id,
                    paylink: response,
                    bookingType: "Event",
                    resaId: reservationRaw.id,
                    amount: ((event?.price || 0) + total),
                    day: moment.tz("America/Martinique"),
                    hour: moment.tz("America/Martinique").format('HH:mm')
                  });
                } else if (IntcustRaw.attributes.paymentChoice === "stripeOptin") {

                  let params = {
                    stripeAccount: IntcustRaw.attributes.stripeAccId,
                    amount: (((event?.price || 0) + total)) * numcover,
                    customeremail: email,
                    name: firstname + lastname,
                    resaid: reservationRaw.id,
                    mode: "Event",
                    paidType: "order",
                    noukarive: false,
                    toutalivrer: false
                  };


                  const {
                    paymentIntent,
                    ephemeralKey,
                    customer,
                  } = await Parse.Cloud.run("stripeCheckoutForRN", params);


                  let ERR = {};
                  setCrenModalVisible(false)

                  ERR = await initPaymentSheet({
                    merchantDisplayName: IntcustRaw.attributes.corporation,
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
                      bookingType: 'Event',
                      resaId: reservationRaw.id,
                      amount: ((event?.price || 0) + total),
                      day: moment.tz("America/Martinique"),
                      hour: moment.tz("America/Martinique").format('HH:mm')
                    });
                  }
                  setPaymentSheetEnabled(false);
                  setLoading(false);
                }
              }
            }
          }}
          style={styles.appButtonContainer}
          disabled={!isResaConfirmed && (!firstname || !lastname || !phone || !email)}
        >
          <Text style={styles.appButtonText}>{isResaConfirmed ? 'Revenir à l\'accueil' : (event?.freeconfirm ? 'Confirmer gratuitement' : 'Confirmer')}</Text>
        </TouchableOpacity>
      </Modal>
      <ScrollView style={styles.wrap} showsVerticalScrollIndicator={false}>
        {!event?.imageUrl ||
          (event.imageUrl == "" && (
            <View style={styles.wrapindicator}>
              <ActivityIndicator size="large" color="#F50F50" />
            </View>
          ))}
        <Image
          source={{
            uri: event?.imageUrl || "https://storage.googleapis.com/tablereports/dc8122fc87e947474c7afbae6c1258b0_diner.jpeg",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={{ top: -40, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20 }}>
          <Text style={styles.title}>{event?.title} </Text>
          <Text style={styles.subtitle2}>{event?.restaurant}</Text>
          <Text style={styles.subtitle}>{event?.date} - {event?.time}</Text>
          <Text style={styles.subtitle2}>Tarif unique : {event?.price}€TTC</Text>
          <Text style={styles.subtitle2}>Infoline : {event?.infoline}</Text>
          <View style={styles.wrapwebview}>
            <HTML
              source={{ html: html || " a" }}
              tagsStyles={tagsStyles}
              contentWidth={400}
            />
          </View>

          <Text style={styles.subtitle2}>Nombre places restantes : {event?.seatleft}</Text>
          {
            enabledModes && enabledModes.length > 0 &&
            <View style={styles.modeContainer}>
              {
                enabledModes.map(enabledMode => (
                  <RadioItem key={enabledMode} checked={mode === enabledMode} setChecked={() => setMode(enabledMode)} title={enabledMode === "SurPlace"? "Sur Place" : enabledMode === "Delivery"? "En livraison" : "A emporter"}/>
                ))
              }
            </View>
          }
          {lineitems.map((line, index) => {
            if (line.formulaChoice && line.formulaChoice.length > 0 || line.persoData && line.persoData.length > 0)
              return (
                <LineItemCollapse 
                  key={index} 
                  index={index} 
                  line={line}
                  engagModeResa={mode}
                  selectedPricevarIndexes={selectedPricevarIndexes}
                  setSelectedPricevarIndexes={(val: any) => setSelectedPricevarIndexes(val)}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  checkMessFormula={checkMessFormula}
                  checkMessPerso={checkMessPerso}
                  addQuantityFromLines={addQuantityFromLines}
                  removeQuantityFromLines={removeQuantityFromLines}
                  deleteFromLines={deleteFromLines}
                  addFormulaMenuChoice={addFormulaMenuChoice}
                  removeFormulaMenuChoice={removeFormulaMenuChoice}
                  updatePersoNumChecked={updatePersoNumChecked}
                />
              )
            else return(
              <LineItem 
                key={index} 
                index={index} 
                line={line}
                engagModeResa={mode}
                selectedPricevarIndexes={selectedPricevarIndexes}
                setSelectedPricevarIndexes={(val: any) => setSelectedPricevarIndexes(val)}
                checkMessFormula={checkMessFormula}
                checkMessPerso={checkMessPerso}
                addQuantityFromLines={addQuantityFromLines}
                removeQuantityFromLines={removeQuantityFromLines}
                deleteFromLines={deleteFromLines}
              />
            )
          })}
          <Text style={styles.totalText}>Total: {(event?.price || 0) + total}€TTC</Text>
        </View>
      </ScrollView>
      {(event?.seatleft || 0) == 0 &&
        <Text style={{ fontFamily: "geometria-regular", margin: 20, alignSelf: "center", fontSize: 15, color: "red" }}>Complet ! Plus de places disponibles</Text>}
      {(event?.seatleft || 0) > 0 &&
        <TouchableOpacity
          onPress={() => {
            setCrenModalVisible(true);
          }}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Réservez</Text>
        </TouchableOpacity>
      }
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  wrap: {
    flex: 1,
  },
  appButtonContainer: {
    marginBottom: 20,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    fontFamily: 'geometria-regular',
  },
  wrapwebview: {
    flex: 1,
    width: "90%",

    marginLeft: 20,
  },
  webview: {
    flex: 1,
    width: "100%",
    fontSize: 18,
    color: "white",
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "geometria-bold",
    alignSelf: "center",
  },
  title: {
    fontSize: 25,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
  },
  subtitle: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom: 20,
    flexWrap: "wrap",
    fontFamily: "geometria-regular",
  },
  subtitle2: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
  },
  text: {
    fontSize: 16,
    padding: 4,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  wrapindicator: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: 300,
  },
  btnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 25,
    color: "white",
    backgroundColor: "#ff5050",
  },
  btn: {
    height: 50,
    width: 50,
    color: "white",
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
  textInput: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1
  },
  modeContainer: {
    marginLeft: 10,
    marginBottom: 10
  },
  totalText: {
    backgroundColor: "rgb(255,194,64)",
    marginTop: 20,
    marginHorizontal: 30,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "geometria-bold",
  }
});

export default EventScreen;

