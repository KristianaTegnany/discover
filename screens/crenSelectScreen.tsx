import { NavigationState } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Route, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment-timezone';
import "moment/locale/fr";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  theme: ThemeProps;
}
type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export const crenSelectScreen = ({ route, navigation, theme }: Props) => {
  const [daystobook, setDaystobook] = useState<ItemType[]>([]);
  const [hourstobook, setHourstobook] = useState<ItemType[]>([]);
  const {day, hour } = route.params
  const [selectedDay, setSelectedDay] = useState<any>(day? day : '');
  const [selectedHour, setSelectedHour] = useState<any>(hour? hour : '');
  const [openDate, setOpenDate] = useState(false);
  const [openHour, setOpenHour] = useState(false);
  const [goto, setGoto] = useState("Aaa");
  const [loading, setLoading] = useState(true)

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

  async function fetchHours() {
    setLoading(true)
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = route.params.restoId;
    let params2 = {
      itid: route.params.restoId,
      date: moment.tz(selectedDay, 'YYYY-MM-DD', 'America/Martinique').toDate(), //moment.tz(date.substr(0, 10), 'America/Martinique').format(),
      bookingType: route.params.bookingType,
    };
    const res3 = await Parse.Cloud.run("getIntcustWithAvailableCren", params2);
    setHourstobook(res3.crenAvailable.map((cren:any) => {
      return {
        label: cren,
        value: cren
      }
    }));

    if (["Delivery", "TakeAway"].includes(route.params.bookingType)) {
      setGoto("orderScreen");
    } else if (route.params.bookingType == "OnSite") {
      setGoto("resaScreen");
    }
    setLoading(false)
  }

  function fetchDays() {
    var Intcust = Parse.Object.extend("Intcust");
    let intcustRaw = new Intcust();
    intcustRaw.id = route.params.restoId;
    var businessHours = [];

    if (route.params.bookingType == "TakeAway") {
      businessHours = intcustRaw.get("businessHoursTaway");
    } else if (route.params.bookingType == "Delivery") {
      businessHours = intcustRaw.get("businessHoursDelivery");
    } else if (route.params.bookingType == "OnSite") {
      businessHours = intcustRaw.get("businesshours");
    }
    let day = moment.tz('America/Martinique');
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
          value: moment.tz(day, 'America/Martinique').format('YYYY-MM-DD'),
        });
      }
      day.add(1, "day");
    }
    setSelectedDay(days[0].value)
    setDaystobook(days);
    setLoading(false)
  }

  useEffect(() => {
    fetchDays()
  }, [])

  useEffect(() => {
    if(selectedDay)
      fetchHours()
  }, [selectedDay])

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.dateText, { color: textColor }]}>Sélectionnez la date</Text>
      <DropDownPicker
        open={openDate}
        value={selectedDay}
        items={daystobook}
        setOpen={setOpenDate}
        setValue={setSelectedDay}
        setItems={setDaystobook}
        placeholder="Date ..."
        style={[styles.dropdown, styles.shadow]}
        labelStyle={styles.labeldropdown}
        placeholderStyle={styles.labeldropdown}
        dropDownContainerStyle={styles.dropdown}
      />
      {
        !openDate &&
        <>
          <Text style={[styles.hourText, { color: textColor }]}>Sélectionnez l'heure</Text>
          <DropDownPicker
            open={openHour}
            value={selectedHour}
            items={hourstobook}
            setOpen={setOpenHour}
            setValue={setSelectedHour}
            setItems={setHourstobook}
            placeholder="Heure ..."
            style={[styles.dropdown, styles.shadow]}
            labelStyle={styles.labeldropdown}
            placeholderStyle={styles.labeldropdown}
            dropDownContainerStyle={styles.dropdown}
          />
        </>
      }
      {
        <View style={[styles.btnNextContainer, styles.shadow, {opacity: selectedDay === '' || selectedHour === ''? 0.5 : 1}]}>
          <TouchableOpacity onPress={() =>
              navigation.navigate(goto, {
                restoId: route.params.restoId,
                bookingType: route.params.bookingType,
                day: selectedDay,
                hour: selectedHour
              })
            } 
            style={styles.btnNext} disabled={selectedDay === '' || selectedHour === ''}>
            <Ionicons name="arrow-back" size={25} color='white' style={styles.arrow}/>
          </TouchableOpacity>
        </View>
      }
      {selectedDay !== '' && !loading && hourstobook && hourstobook.length == 0 && (
        <View>
          <Text style={styles.textstrong}>
            Plus d'horaires disponibles ! 🤷🏽‍♂️
          </Text>
          <Text style={styles.text}>Les raisons possibles : </Text>
          <Text style={styles.text}>
            ➡️ L'heure limite de commande est passée.
          </Text>
          <Text style={styles.text}>
            ➡️ Le restaurant nous a informé d'un nombre limite de commande
            atteint pour ce créneau.
          </Text>
          <Text style={styles.text}>➡️ Il est fermé exceptionnellement.</Text>

          <Text style={styles.text}>
            Vous pouvez choisir un autre jour ou un autre restaurant en revenant
            en arrière.
          </Text>
        </View>
      )}
      {loading && (
        <View style={styles.wrapindicator}>
          <ActivityIndicator size="large" color="#F50F50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    flex: 1
  },
  dropdown: {
    borderColor:'transparent',
    backgroundColor: '#ff5050'
  },
  labeldropdown: {
    color: 'white' ,
    fontWeight:'bold'
  },
  dateText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  hourText: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  btnNextContainer: {
    position:'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 25,
    backgroundColor: '#ff5050',
  },
  btnNext: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrow: {
    transform:[{
      rotate: '180deg'
    }]
  },
  wrapindicator: {
    position:'absolute',
    alignItems: "center",
    top: '50%',
    left: '50%',
    justifyContent: "center",
  },
  textstrong: {
    fontWeight: "bold",
    fontFamily: "geometria-bold",
    paddingVertical: 20,
    fontSize: 18,
    paddingLeft: 4,
  },
  text: {
    fontSize: 16,
    padding: 4,
    fontFamily: "geometria-regular",
  },
  shadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  }
});

export default crenSelectScreen;
