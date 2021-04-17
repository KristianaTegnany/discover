import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import {  ColorSchemeName } from 'react-native';
import basketScreen from '../screens/basketScreen';
import crenSelectScreen from '../screens/crenSelectScreen';
import deliveryScreen from '../screens/deliveryScreen';
import DishScreen from '../screens/DishScreen';
import GuideScreen from '../screens/GuideScreen';
import hourSelectScreen from '../screens/hourSelectScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import resaScreen from '../screens/resaScreen';
import RestoScreen from '../screens/RestoScreen';
import takeawayScreen from '../screens/takeawayScreen';
import {  RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';


import LinkingConfiguration from './LinkingConfiguration';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
      <Stack.Screen name="Root" options={{ headerShown: false, headerTitle: 'Accueil' }}   component={BottomTabNavigator} />
      <Stack.Screen name="GuideScreen"  options={{ headerTitle: 'Guide' }} component={GuideScreen} />
      <Stack.Screen name="RestoScreen" options={{ headerTitle: 'Restaurant' }} component={RestoScreen} />
      <Stack.Screen name="deliveryScreen" options={{ headerTitle: 'Livraison' }} component={deliveryScreen} />
      <Stack.Screen name="resaScreen" options={{ headerTitle: 'Réservation sur place' }} component={resaScreen} />
      <Stack.Screen name="takeawayScreen"  options={{ headerTitle: 'A emporter' }} component={takeawayScreen} />
      <Stack.Screen name="DishScreen"  options={{ headerTitle: '😋' }} component={DishScreen}  />
      <Stack.Screen name="crenSelectScreen"  options={{ headerTitle: 'Choisir un jour' }} component={crenSelectScreen} />
      <Stack.Screen name="hourSelectScreen"  options={{ headerTitle: 'Choisir une heure' }} component={hourSelectScreen} />
      <Stack.Screen name="basketScreen"  options={{ headerTitle: 'Votre panier' }} component={basketScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}


