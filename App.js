// App.js (Partie 1 - Version de base)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoginFormScreen from './screens/LoginFormScreen';
import RegisterFormScreen from './screens/RegisterFormScreen';
import RecuperationScreen from './screens/RecuperationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginFormScreen} />
        <Stack.Screen name="Register" component={RegisterFormScreen} />
        <Stack.Screen name="Recuperation" component={RecuperationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
