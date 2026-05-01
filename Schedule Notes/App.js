import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

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
