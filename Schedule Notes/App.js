import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    }
    requestPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {appIsReady ? (
        <AppNavigator />
      ) : (
        <AnimatedSplashScreen onFinish={() => setAppIsReady(true)} />
      )}
    </SafeAreaProvider>
  );
}
