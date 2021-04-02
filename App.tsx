import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from "expo-font";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import  AsyncStorage  from "@react-native-async-storage/async-storage";
var Parse = require("parse/react-native");
import {AppearanceProvider} from 'react-native-appearance';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("table");
Parse.serverURL = `https://prodtableserver.osc-fr1.scalingo.io/parse`;

export default  function    App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
     loadResourcesAsync() ;

    return (
      <AppearanceProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
      </AppearanceProvider>

    );
  }

  async function loadResourcesAsync() {
    await Promise.all([
       Font.loadAsync({
        "work-sans-regular": require("./assets/fonts/work-sans-regular.ttf"),
        "work-sans-700": require("./assets/fonts/work-sans-700.ttf")
      })
    ]);
    return 1
  }
  
}
