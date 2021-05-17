import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import basketScreen from "../screens/basketScreen";
import custInfoScreen from "../screens/custInfoScreen";
import orderScreen from "../screens/orderScreen";
import DishScreen from "../screens/DishScreen";
import GuideScreen from "../screens/GuideScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import paymentScreen from "../screens/paymentScreen";
import resaScreen from "../screens/resaScreen";
import RestoScreen from "../screens/RestoScreen";
import successScreen from "../screens/successScreen";
import termsScreen from "../screens/termsScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";

import LinkingConfiguration from "./LinkingConfiguration";
import paymentStripeScreen from "../screens/paymentStripeScreen";
import { persoScreen } from "../screens/persoScreen";
import hourSelectScreen from "../screens/hourSelectScreen";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Root"
        options={{ headerShown: false, headerTitle: "Accueil" }}
        component={BottomTabNavigator}
      />
      <Stack.Screen
        name="GuideScreen"
        options={{ headerTitle: "", headerTransparent: true,
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200", 
        //  color:"green"
        } }}
        component={GuideScreen}
      />
      <Stack.Screen
        name="RestoScreen"
        options={{ headerTitle: "", headerTransparent: true,
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200", 
        //  color:"green"
        } }}
        component={RestoScreen}
      />
      <Stack.Screen
        name="orderScreen"
        options={orderScreen.navigationOptions}
        component={orderScreen}
      />
      <Stack.Screen
        name="resaScreen"
        options={{ headerTitle: "Réservation sur place",
        headerBackTitle: 'Retour',
        headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        },
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        } }}
        component={resaScreen}
      />
      <Stack.Screen
        name="DishScreen"
        options={{ headerTitle: "😋" , 
        headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        },
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        }}}
        component={DishScreen}
      />
      {/* <Stack.Screen
        name="crenSelectScreen"
        options={{ headerTitle: "Choisir un jour", 
        headerBackTitle: 'Retour',
        headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        },
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        }
      }}
        component={crenSelectScreen}
      /> */}
      <Stack.Screen
        name="hourSelectScreen"
        options={{ headerTitle: "Choisir une heure",
        headerBackTitle: 'Retour',
        headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        },
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        }
      }}
        component={hourSelectScreen}
      />
      <Stack.Screen
        name="basketScreen"
        options={{ headerTitle: "Votre panier", 
        headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        },
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        } }}
        component={basketScreen}
      />
      <Stack.Screen
        name="paymentScreen"
        options={{ headerTitle: "Paiement", headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        } }}
        component={paymentScreen}
      />
      <Stack.Screen
        name="termsScreen"
        options={{ headerTitle: "CGU" }}
        component={termsScreen}
      />
      <Stack.Screen
        name="custInfoScreen"
        options={{ headerTitle: "Vos infos",
        headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        },
        headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        } }}
        component={custInfoScreen}
      />
      <Stack.Screen
        name="successScreen"
        options={{ headerTitle: "", headerTransparent: true, 
        headerLeft: ()=> null, // Note: using just `null` instead of a function should also work but could trigger a TS error
      }}
        component={successScreen}
      />
      <Stack.Screen
        name="paymentStripeScreen"
        options={{ headerTitle: "Paiement", headerTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        } , headerBackTitleStyle: {
          fontFamily: "geometria-regular",
          fontWeight: "200"
        } }}
        component={paymentStripeScreen}
      />
      <Stack.Screen
        name="persoScreen"
        options={{ headerTitle: "Perso" }}
        component={persoScreen}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
