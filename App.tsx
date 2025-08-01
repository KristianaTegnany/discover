import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import * as Font from "expo-font";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
var Parse = require("parse/react-native");
import { AppearanceProvider } from "react-native-appearance";
import { withAppContextProvider } from "./components/GlobalContext"; // add this
import { AppRegistry, Platform } from "react-native";
import { expo as appName } from "./app.json";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import { StripeProvider } from "@stripe/stripe-react-native";
import { stripeAccIdResto } from "./screens/RestoScreen";
import * as Sentry from "sentry-expo";
//import * as SecureStore from "expo-secure-store";
//import Constants from "expo-constants";
//import * as Notifications from "expo-notifications";
//import * as Application from "expo-application";

Sentry.Native;
Sentry.Browser;
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("table");
Parse.serverURL = `https://prodtableserver.osc-fr1.scalingo.io/parse`; //`https://pptableserver.osc-fr1.scalingo.io/parse`;
Sentry.init({
  dsn:
    "https://8a30ffe4a08647e889bb528cf8a3b14a@o724568.ingest.sentry.io/5782293",
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [
    stripeAccIdRestoValue,
    setstripeAccIdRestoValue,
  ] = stripeAccIdResto.use();
  loadResourcesAsync();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <StripeProvider
          stripeAccountId={stripeAccIdRestoValue}
          publishableKey="pk_live_oSFogrn8ZMJM8byziUY0Wngh00QiPeTyNg"
        >
          <AppearanceProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </AppearanceProvider>
        </StripeProvider>
      </Provider>
    );
  }

  async function loadResourcesAsync() {
    await Promise.all([
      Font.loadAsync({
        "geometria-regular": require("./assets/fonts/GeometriaLight.otf"),
        "geometria-bold": require("./assets/fonts/GeometriaBold.ttf"),
      }),
    ]);
    return 1;
  }
}

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const {
//       status: existingStatus,
//     } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     let installationId;
//     if (Platform.OS === "android") {
//       installationId = Application.androidId;
//     }
//     if (Platform.OS === "ios") {
//       let result = await SecureStore.getItemAsync("installationid");
//       if (result) {
//         //   console.log("🔐 Here's your value 🔐 \n" + result);
//         installationId = result;
//       } else {
//         console.log("No values stored under that key.");
//         save("installationid", Math.random().toString(36).substr(2, 20));
//       }
//     }

//     async function save(key:any, value:any) {
//       await SecureStore.setItemAsync(key, value);
//     }
//     //   console.log(token);
//     let params = {
//       token: token,
//       installationId: installationId,
//       userId: (await Parse.User.currentAsync()).id,
//     };
//     const res = await Parse.Cloud.run("createInstallationGuest", params);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// 

AppRegistry.registerComponent(appName.name, () => withAppContextProvider(App));
