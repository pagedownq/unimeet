import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';

export default function IndexScreen() {
  const { profile, isLoading } = useOnboarding();

  useEffect(() => {
    if (!isLoading) {
      if (profile.completedOnboarding) {
        router.replace('/(tabs)/explore');
      } else {
        router.replace('/(onboarding)/step1');
      }
    }
  }, [isLoading, profile.completedOnboarding]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
