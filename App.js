import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
// import Details from './screens/Details';

const Stack = createNativeStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          headerTransparent: true
        }}>
          <Stack.Screen name="Home" component={Home} />
          {/* <Stack.Screen name="Details" component={Details} options={{
            headerShown: true,
            headerTransparent: true,
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: 'transparent',
              border: "none"
            },
          }} /> */}
        </Stack.Navigator>
      </NavigationContainer>
  );
};