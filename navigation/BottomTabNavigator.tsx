import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TablesScreen from '../screens/TablesScreen';
import GuidesScreen from '../screens/GuidesScreen';

import { BottomTabParamList, TablesParamList, GuidesParamList,GuideParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Tables"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Tables"
        component={TablesNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="restaurant" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Guides"
        component={GuidesNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
   
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TablesStack = createStackNavigator<TablesParamList>();

function TablesNavigator() {
  return (
    <TablesStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <TablesStack.Screen
        name="TablesScreen"
        component={TablesScreen}
        options={{ headerTitle: 'Restaurants' }}

      />
    </TablesStack.Navigator>
  );
}

const GuidesStack = createStackNavigator<GuidesParamList>();

function GuidesNavigator() {
  return (
    <GuidesStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <GuidesStack.Screen
        name="GuidesScreen"
        component={GuidesScreen}
        options={{ headerTitle: 'Guides' }}
      />
    </GuidesStack.Navigator>
  );
  }
 