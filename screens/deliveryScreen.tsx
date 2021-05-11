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

export default class deliveryScreen extends React.Component<Props, state> {
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
                  <ListItem.Title style={styles.text}>
                    {menu.attributes.title}{" "}
                  </ListItem.Title>
                  <ListItem.Subtitle style={styles.minitext}>
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
  },
  title: {
    fontSize: 20,
    padding: 30,
    fontWeight: "bold",
    fontFamily: "geometria-bold",
  },
  text: {
    fontSize: 16,
    padding: 4,
    fontWeight: "bold",
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
  image: {
    flex: 1,
    width: 400,
    paddingTop: 110,
  },
});
