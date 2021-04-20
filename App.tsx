import { StatusBar } from 'expo-status-bar';
import React from 'react';
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
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from "react-native-elements";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("table");
Parse.serverURL = `https://pptableserver.osc-fr1.scalingo.io/parse`;


export default   function    App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
 
  loadResourcesAsync() ;
  if (!isLoadingComplete) {
    return null;
  } else {
    

    return (
      <Provider store={store}>

      <AppearanceProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />

      </SafeAreaProvider>
      </AppearanceProvider>
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
