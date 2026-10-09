import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { OnboardingProvider } from '@/context/OnboardingContext';
import '@/i18n';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <OnboardingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
        </Stack>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
