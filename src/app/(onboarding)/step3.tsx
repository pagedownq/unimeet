import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { extractUniversityFromEmail, isValidEduEmail } from '@/utils/universityDomainMatcher';
import { useOnboarding } from '@/context/OnboardingContext';

export default function Step3Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [email, setEmail] = useState(profile.email || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [focused, setFocused] = useState(false);

  const detectedUni = extractUniversityFromEmail(email);
  const isValid = isValidEduEmail(email);

  const btnScale = useSharedValue(1);
  const inputBorder = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const inputBorderStyle = useAnimatedStyle(() => ({
    borderColor: inputBorder.value === 1
      ? '#6366f1'
      : inputBorder.value === 2
      ? '#ef4444'
      : '#e5e7eb',
    borderWidth: inputBorder.value === 1 ? 2 : 1.5,
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleNext = () => {
    if (!isValid) {
      setErrorMessage(t('onboarding.invalid_email'));
      shakeX.set(
        withSequence(
          withTiming(-10, { duration: 60 }),
          withTiming(10, { duration: 60 }),
          withTiming(-8, { duration: 60 }),
          withTiming(8, { duration: 60 }),
          withTiming(0, { duration: 60 })
        )
      );
      inputBorder.set(withTiming(2, { duration: 200 }));
      return;
    }
    setErrorMessage('');
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    const uniName = detectedUni ? detectedUni.name : 'Üniversite Doğrulandı';
    updateProfile({ email: email.trim(), universityName: uniName });
    router.push('/(onboarding)/step4');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.iconRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="mail" size={28} color="#6366f1" />
                </View>
              </View>
              <Text style={styles.title}>{t('onboarding.email_title')}</Text>
              <Text style={styles.subtitle}>
                Üniversiteni tespit edebilmemiz için öğrenci e-posta adresini gir.
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={[shakeStyle]}
            >
              <Animated.View style={[styles.inputContainer, inputBorderStyle]}>
                <Ionicons name="mail-outline" size={22} color={focused ? '#6366f1' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.email_placeholder')}
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setErrorMessage('');
                    inputBorder.set(withTiming(1, { duration: 200 }));
                  }}
                  onFocus={() => {
                    setFocused(true);
                    inputBorder.set(withTiming(1, { duration: 200 }));
                  }}
                  onBlur={() => {
                    setFocused(false);
                    inputBorder.set(withTiming(0, { duration: 200 }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {isValid && (
                  <Animated.View entering={FadeIn.duration(300)}>
                    <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                  </Animated.View>
                )}
              </Animated.View>
            </Animated.View>

            {errorMessage ? (
              <Animated.Text entering={FadeIn} style={styles.errorText}>
                ⚠ {errorMessage}
              </Animated.Text>
            ) : null}

            {detectedUni ? (
              <Animated.View entering={FadeInDown.springify()} style={styles.detectedCard}>
                <View style={styles.detectedIconBox}>
                  <Ionicons name="school" size={22} color="#10b981" />
                </View>
                <View style={styles.detectedInfo}>
                  <Text style={styles.detectedLabel}>{t('onboarding.detected_uni')}</Text>
                  <Text style={styles.detectedName}>{detectedUni.name}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color="#10b981" />
              </Animated.View>
            ) : null}
          </View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity
              style={[styles.nextBtn, !isValid && styles.disabledBtn]}
              onPress={handleNext}
              disabled={!isValid}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>{t('common.next')}</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 16,
  },
  iconRow: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#eeeffe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 23,
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
  },
  detectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#6ee7b7',
    padding: 16,
    borderRadius: 18,
    marginTop: 18,
    gap: 12,
  },
  detectedIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectedInfo: { flex: 1 },
  detectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detectedName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065f46',
    marginTop: 2,
  },
  nextBtn: {
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
  disabledBtn: {
    backgroundColor: '#c7d2fe',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
});
