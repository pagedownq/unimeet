import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps?: number;
  showBack?: boolean;
  onBack?: () => void;
}

const COLORS = [
  '#6366f1', // step 1
  '#8b5cf6', // step 2
  '#ec4899', // step 3
  '#f59e0b', // step 4
  '#10b981', // step 5
  '#6366f1', // step 6
  '#0ea5e9', // step 7
  '#f97316', // step 8
  '#8b5cf6', // step 9
  '#ec4899', // step 10
  '#10b981', // step 11
  '#6366f1', // step 12
  '#0ea5e9', // step 13
  '#f59e0b', // step 14
];

export function OnboardingHeader({
  currentStep,
  totalSteps = 14,
  showBack = true,
  onBack,
}: OnboardingHeaderProps) {
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);
  const progressWidth = useSharedValue(0);
  const activeColor = COLORS[(currentStep - 1) % COLORS.length];

  useEffect(() => {
    progressWidth.set(withSpring(progressPercent, { damping: 18, stiffness: 120 }));
  }, [progressPercent, progressWidth]);

  const animatedBar = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.topRow}>
        {showBack && currentStep > 1 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#1f2937" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* Step Pills */}
        <View style={styles.stepsRow}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i < currentStep && { backgroundColor: activeColor },
                i === currentStep - 1 && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={[styles.stepBadge, { backgroundColor: activeColor + '20', borderColor: activeColor + '50' }]}>
          <Text style={[styles.stepText, { color: activeColor }]}>
            {currentStep}/{totalSteps}
          </Text>
        </View>
      </View>

      {/* Animated Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressBar, animatedBar, { backgroundColor: activeColor }]}
        />
        {/* Glowing tip */}
        <Animated.View
          style={[
            styles.progressGlow,
            animatedBar,
            { shadowColor: activeColor },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 36,
  },
  stepsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 8,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    maxWidth: 16,
  },
  activeDot: {
    transform: [{ scaleY: 1.5 }],
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressGlow: {
    position: 'absolute',
    right: 0,
    top: -2,
    height: 9,
    width: 9,
    borderRadius: 4.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
