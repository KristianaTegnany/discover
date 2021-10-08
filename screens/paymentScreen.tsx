import { NavigationState } from "@react-navigation/native";
import * as React from "react";
import { Route, StyleSheet } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { useEffect } from "react";
import { WebView } from "react-native-webview";

interface NavigationParams {
  restoId: string;
  paylink: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export const paymentScreen = ({ route, navigation }: Props) => {
  function checkUrlState(url: any) {
    if (url.includes("tablediscover")) {
      // code to hide WebView
      navigation.navigate("successScreen", {
        bookingType: route.params.bookingType,
        resaId: route.params.resaId,
        day: route.params.day,
        hour: route.params.hour,
        amount: route.params.amount,
      });
    }
    if (url.includes("tablebig")) {
      navigation.navigate("custInfoScreen", {
        bookingType: route.params.bookingType,
        resaId: route.params.resaId,
        day: route.params.day,
        hour: route.params.hour,
        amount: route.params.amount,
      });
    }
  }

  return (
    <WebView
      source={{ uri: route.params.paylink }}
      style={{ marginTop: 0 }}
      onNavigationStateChange={(state) => checkUrlState(state.url)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appButtonContainer: {
    elevation: 8,
    marginBottom: 10,
    marginTop: 30,
    backgroundColor: "#ff5050",
    borderRadius: 10,
    marginRight: 30,
    marginLeft: 30,
    paddingVertical: 13,
    paddingHorizontal: 14,
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
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
    fontFamily: "geometria-bold",
  },
  headertext: {
    fontFamily: "geometria-bold",
    color: "white",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 20,
    fontFamily: "geometria-bold"
  },
  textBold: {
    flex: 1,
    fontSize: 16,
    top: 0,
    fontFamily: "geometria-bold",
    padding: 20,
  },
  textRaw: {
    flex: 1,
    fontSize: 16,
    top: 0,
    fontFamily: "geometria-regular",
  },
  text: {
    flex: 1,
    fontSize: 16,
    top: 0,
    fontFamily: "geometria-regular",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default paymentScreen;
