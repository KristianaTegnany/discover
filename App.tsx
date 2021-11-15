import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import * as Font from "expo-font";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
var Parse = require("parse/react-native");
import { AppearanceProvider } from "react-native-appearance";
import { withAppContextProvider } from "./components/GlobalContext"; // add this
import { Alert, BackHandler, Linking, Platform } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import { StripeProvider } from "@stripe/stripe-react-native";
import { stripeAccIdResto } from "./screens/RestoScreen";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Application from "expo-application";
// @ts-ignore
import VersionCheck from 'react-native-version-check';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("table");
Parse.serverURL = `https://prodtableserver.osc-fr1.scalingo.io/parse`; // `https://pptableserver.osc-fr1.scalingo.io/parse`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
});

const App = () => {
  const isLoadingComplete = useCachedResources() || false;
  const colorScheme = useColorScheme();
  const [
    stripeAccIdRestoValue
    ,
  ] = stripeAccIdResto.use();

  // loadResourcesAsync()

  let notificationListener: any;
  notificationListener = useRef();

  let responseListener: any;
  responseListener = useRef();

  const checkForUpdate = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Mise à jour', 
          'Il y a une nouvelle mise à jour. Vous devriez mettre à jour votre application pour continuer son utilisation.',
          [
            {
              text: 'Mettre à jour',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl)
              }
            }
          ],
          { cancelable: false }
        )
      }
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkForUpdate()
    registerForPushNotificationsAsync().then(token => {});

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      console.log(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    loadResourcesAsync();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function save(key: any, value: any) {
    await SecureStore.setItemAsync(key, value);
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert(
          "Table Manager est mieux avec les notifications. N'hésitez pas à accorder plus tard."
        );
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;

      let installationId;
      if (Platform.OS === "android") {
        installationId = Application.androidId;
      }
      if (Platform.OS === "ios") {
        let result = await SecureStore.getItemAsync("installationid");
        if (result) {
          //   console.log("🔐 Here's your value 🔐 \n" + result);
          installationId = result;
        } else {
          console.log("No values stored under that key.");
          save("installationid", Math.random().toString(36).substr(2, 20));
        }
      }

      let params = {
        token: token,
        installationId: installationId,
        userId: 'notyet',
        platform: Platform.OS
      };

      const res = await Parse.Cloud.run("createInstallationGuest", params);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }


  async function sendPushNotification(expoPushToken: any) {
    const message = {
      to: expoPushToken,
      title: "Original Title",
      body: "And here is the body!"
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  async function sendPushToDiscover(token: any) {
    //const InstallDisco = await Parse.Cloud.run("getInstallationsDiscover");
    console.log("tgere")
    console.log(token)

    const params = {
      token: token,
      title: 'Test de push notif Discover',
      body: 'message cool',
    };
    const res = Parse.Cloud.run("sendPush", params)
    console.log(params)

    console.log(res)
  }

  if (isLoadingComplete)
    return (
      <Provider store={store}>
        <StripeProvider
          stripeAccountId={stripeAccIdRestoValue}
          publishableKey="pk_live_oSFogrn8ZMJM8byziUY0Wngh00QiPeTyNg" // "" pk_test_9xQUuFXcOEHexlaI2vurArT200gKRfx5Gl// 
        >
          <AppearanceProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </AppearanceProvider>
        </StripeProvider>
      </Provider>
    );
  else return null

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


export default withAppContextProvider(App);
