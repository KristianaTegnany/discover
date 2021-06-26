import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  Route,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import moment from "moment";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import { ScrollView } from "react-native-gesture-handler";
import HTML from "react-native-render-html";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
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
  date:string;
  time:string;
  restaurant :string;
  price : number;
  infoline:string
}

export const EventScreen = ({ route, navigation }: Props) => {
  const [html, setHtml] = useState()
  const [event, setEvent] = useState<IEvent>();
  const [crenModalVisible, setCrenModalVisible] = useState(false);
  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");
  const tagsStyles = {
    p: { fontFamily: "geometria-regular", fontSize: 18, color: textColor },
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

  useEffect(() => {
    var Event = Parse.Object.extend("Event");
    let eventRaw = new Event();
    eventRaw.id = route.params.eventId;
     setHtml(eventRaw.attributes.description)
    setEvent({
      id: eventRaw.id || "",
      imageUrl: eventRaw.attributes.image._url || "",
      content: eventRaw.attributes.description || " a",
      title: eventRaw.attributes.title || "",
      date: moment(eventRaw.attributes.date).format("dddd DD MMM") || "",
      time: moment(eventRaw.attributes.date).format("HH:mm") || "",
      restaurant: eventRaw.attributes.intcust.attributes.corporation || "",
      price: eventRaw.attributes.price || "",
      infoline: eventRaw.attributes.infoline || "",

    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.wrap}>
        {!event?.imageUrl ||
          (event.imageUrl == "" && (
            <View style={styles.wrapindicator}>
              <ActivityIndicator size="large" color="#F50F50" />
            </View>
          ))}
        <Image
          source={{
            uri: event?.imageUrl || "d",
          }}
          style={styles.image}
          resizeMode="cover"
        ></Image>
        <View style={{top:-40, borderTopLeftRadius:20,borderTopRightRadius:20, paddingTop:20}}>
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


        </View>
      </ScrollView>
      <TouchableOpacity
            onPress={() => {
                setCrenModalVisible(true);
            }}
            style={styles.appButtonContainer}
          >
            <Text style={styles.appButtonText}>Réservez</Text>
          </TouchableOpacity>

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
  //  elevation: 8,
    marginBottom: 20,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal:10,
    fontFamily:'geometria-regular',
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
fontFamily:"geometria-bold",
    alignSelf: "center",
  },
  title: {
    fontSize: 25,
    marginLeft: 20,
    marginTop: 20,
    marginBottom:20,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
  },
  subtitle: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom:20,
    flexWrap: "wrap",
    fontFamily: "geometria-regular",
  },
  subtitle2: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    marginBottom:10,
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
});

export default EventScreen;
