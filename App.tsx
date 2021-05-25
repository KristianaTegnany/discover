import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from "expo-font";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
var Parse = require("parse/react-native");
import {AppearanceProvider} from 'react-native-appearance';
import {withAppContextProvider} from './components/GlobalContext'; // add this
import {AppRegistry} from 'react-native';
import {expo as appName} from './app.json';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { StripeProvider } from '@stripe/stripe-react-native';
import { stripeAccIdResto } from "./screens/RestoScreen";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("table");
Parse.serverURL = `https://pptableserver.osc-fr1.scalingo.io/parse`; //`https://pptableserver.osc-fr1.scalingo.io/parse`;

export default   function    App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [stripeAccIdRestoValue, setstripeAccIdRestoValue] = stripeAccIdResto.use();


  loadResourcesAsync() ;
  if (!isLoadingComplete) {
    return null;
  } else {
    

    return (
      <Provider store={store}>
      <StripeProvider 
     stripeAccountId={stripeAccIdRestoValue}
      publishableKey="pk_test_9xQUuFXcOEHexlaI2vurArT200gKRfx5Gl">
      <AppearanceProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />

      </SafeAreaProvider>
      </AppearanceProvider>
      </StripeProvider>
      </Provider>
    );
  }

  async function loadResourcesAsync() {
    await Promise.all([
       Font.loadAsync({
        "geometria-regular": require("./assets/fonts/GeometriaLight.otf"),
        "geometria-bold": require("./assets/fonts/GeometriaBold.ttf")
      })
    ]);
    return 1
  }
  
}

AppRegistry.registerComponent(appName.name, () => withAppContextProvider(App));