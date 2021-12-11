import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          headerTransparent: true
        }}>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};