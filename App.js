import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Home from './screens/Home';
import Menu from './screens/Menu';
import AddCity from './screens/AddCity';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{
        headerShown: false,
        headerTransparent: true
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen 
          name="Menu" 
          component={Menu} 
          options={{
            headerShown: true,
            headerTransparent: false,
            title: "Settings"
          }} 
        />
        <Stack.Screen 
          name="AddCity" 
          component={AddCity} 
          options={{
            headerShown: true,
            headerTransparent: false,
            title: "Find city"
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};