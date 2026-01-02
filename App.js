// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import colors from './components/Colors';
import { authService } from './services/authService';
import HomeScreen from './screens/HomeScreen';
import LoginFormScreen from './screens/LoginFormScreen';
import RegisterFormScreen from './screens/RegisterFormScreen';
import RecuperationScreen from './screens/RecuperationScreen';
import DossierListScreen from './screens/DossierListScreen';
import DossierDetailScreen from './screens/DossierDetailScreen';
import PDFViewerScreen from './screens/PDFViewerScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.MidnightBlue }}>
        <ActivityIndicator size="large" color={colors.PrimaryBlue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user ? "DossierListScreen" : "Home"}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginFormScreen} />
            <Stack.Screen name="Register" component={RegisterFormScreen} />
            <Stack.Screen name="Recuperation" component={RecuperationScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="DossierListScreen" component={DossierListScreen} />
            <Stack.Screen name="DossierDetailScreen" component={DossierDetailScreen} />
            <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;