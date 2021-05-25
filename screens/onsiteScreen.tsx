import { NavigationState } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import React, { useState } from "react";
import { Button, Image, Route, ScrollView, StyleSheet } from "react-native";
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { NavigationScreenProp } from "react-navigation";
var Parse = require("parse/react-native");
import { Text, View } from "../components/Themed";
import DishComponent from "../components/DishComponent";
import { ListItem, Icon, ButtonGroup, Badge } from "react-native-elements";

interface NavigationParams {
  restoId: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

type state = { menus: any[] };

export default class onsiteScreen extends React.Component<Props, state> {
  menuCast: any[] = [];

  constructor(Props: any) {
    super(Props);
    this.state = {
      menus: this.menuCast,
    };
  }

  async componentDidMount() {
    this.getMenus();
  }

  async getMenus() {
    let params = {
      itid: this.props.route.params.restoId,
    };
    await Parse.Cloud.run("getMenusActive", params)
      .then((response: any) => {
        this.setState({
          menus: response,
        });
      })
      .catch((error: any) => console.log(error));
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.menus !== null &&
            this.state.menus !== undefined &&
            this.state.menus.map((menu) => (
              <ListItem key={menu.id} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{menu.attributes.title} </ListItem.Title>
                  <ListItem.Subtitle>
                    {menu.attributes.price} €
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //  flex: 1,
    //  alignItems: 'center',
    justifyContent: "center",
  },
  FlatList: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0,
    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
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
    color: "#fff",
 //   fontWeight: "bold",
 fontFamily: "geometria-bold",

    alignSelf: "center",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    padding: 30,
  //  fontWeight: "bold",
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
  dishComponent: {
    height: 120,
    //  alignSelf: "stretch",
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
    // marginBottom: 47,
    // marginTop: -252
  },
});
