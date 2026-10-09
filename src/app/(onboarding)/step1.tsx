import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const RING_COUNT = 4;

export default function Step1Screen() {
  const { t } = useTranslation();

  // Pulsing rings animation values
  const ring1 = useSharedValue(1);
  const ring2 = useSharedValue(1);
  const ring3 = useSharedValue(1);
  const ringOpacity1 = useSharedValue(0.6);
  const ringOpacity2 = useSharedValue(0.4);
  const ringOpacity3 = useSharedValue(0.2);

  const btnScale = useSharedValue(1);

  useEffect(() => {
    const startRings = () => {
      ring1.set(
        withRepeat(
          withSequence(
            withTiming(1.4, { duration: 900, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) })
          ),
          -1,
          false
        )
      );
      ringOpacity1.set(
        withRepeat(
          withSequence(
            withTiming(0.15, { duration: 900 }),
            withTiming(0.6, { duration: 900 })
          ),
          -1,
          false
        )
      );

      setTimeout(() => {
        ring2.set(
          withRepeat(
            withSequence(
              withTiming(1.4, { duration: 900, easing: Easing.out(Easing.ease) }),
              withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) })
            ),
            -1,
            false
          )
        );
        ringOpacity2.set(
          withRepeat(
            withSequence(
              withTiming(0.1, { duration: 900 }),
              withTiming(0.4, { duration: 900 })
            ),
            -1,
            false
          )
        );
      }, 300);

      setTimeout(() => {
        ring3.set(
          withRepeat(
            withSequence(
              withTiming(1.4, { duration: 900, easing: Easing.out(Easing.ease) }),
              withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) })
            ),
            -1,
            false
          )
        );
        ringOpacity3.set(
          withRepeat(
            withSequence(
              withTiming(0.05, { duration: 900 }),
              withTiming(0.2, { duration: 900 })
            ),
            -1,
            false
          )
        );
      }, 600);
    };

    startRings();
  }, [ring1, ring2, ring3, ringOpacity1, ringOpacity2, ringOpacity3]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1.value }],
    opacity: ringOpacity1.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2.value }],
    opacity: ringOpacity2.value,
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring3.value }],
    opacity: ringOpacity3.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleRequestPermission = async () => {
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      console.warn('Notifications permission error:', e);
    } finally {
      router.push('/(onboarding)/step2');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={1} showBack={false} />
      <View style={styles.container}>
        {/* Animated Icon with pulsing rings */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.iconArea}>
          <Animated.View style={[styles.ring, styles.ring3, ring3Style]} />
          <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
          <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
          <View style={styles.iconCircle}>
            <Ionicons name="notifications" size={52} color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
          {t('onboarding.step1_title')}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.description}>
          {t('onboarding.step1_desc')}
        </Animated.Text>

        {/* Feature pills */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.pills}>
          {['Yeni Eşleşmeler', 'Mesajlar', 'Etkinlikler'].map((pill, i) => (
            <View key={i} style={styles.pill}>
              <Ionicons name="checkmark-circle" size={16} color="#6366f1" />
              <Text style={styles.pillText}>{pill}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.footer}>
          <Animated.View style={btnStyle}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleRequestPermission}
              activeOpacity={0.85}
            >
              <Ionicons name="notifications-outline" size={20} color="#ffffff" />
              <Text style={styles.primaryBtnText}>{t('onboarding.step1_btn')}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/(onboarding)/step2')}
            >
              <Text style={styles.secondaryBtnText}>{t('common.skip')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    paddingTop: 20,
  },
  iconArea: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  ring1: {
    width: 120,
    height: 120,
  },
  ring2: {
    width: 150,
    height: 150,
  },
  ring3: {
    width: 180,
    height: 180,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 28,
  },
  pills: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eeeffe',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
});
