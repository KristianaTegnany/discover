import { NavigationState } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import * as React from "react";
import { Button, Image, Route, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export default class resaScreen extends React.Component<Props> {
  restaurantCast: any[] = [];

  constructor(Props: any) {
    super(Props);
    this.state = {
      restaurant: this.restaurantCast,
    };
  }

  async componentDidMount() {}

  render() {
    var Intcust = Parse.Object.extend("Intcust");
    let myintcust = new Intcust();
    myintcust.id = this.props.route.params.restoId;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Réservez sur place {myintcust.attributes.corporation}{" "}
        </Text>
        <WebView
          source={{
            uri:
              "https://www.tablebig.com/guide/BhCb5xYcek/ida-restaurant-italien-martinique",
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 4,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
  //  color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    padding: 30,
    fontWeight: "bold",
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
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
    // marginBottom: 47,
    // marginTop: -252
  },
});
