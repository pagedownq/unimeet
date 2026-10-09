import React, { useState } from 'react';
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
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    if (password.length === 0) return { level: 0, label: '', color: '#e5e7eb' };
    if (password.length < 6) return { level: 1, label: 'Çok Zayıf', color: '#ef4444' };
    if (password.length < 8) return { level: 2, label: 'Zayıf', color: '#f97316' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { level: 3, label: 'Orta', color: '#f59e0b' };
    return { level: 4, label: 'Güçlü', color: '#10b981' };
  };

  const { level, label, color } = getStrength();

  return (
    <View style={barStyles.container}>
      <View style={barStyles.track}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              barStyles.segment,
              { backgroundColor: i <= level ? color : '#e5e7eb' },
            ]}
          />
        ))}
      </View>
      {label ? <Text style={[barStyles.label, { color }]}>{label}</Text> : null}
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  track: { flex: 1, flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 5, borderRadius: 3 },
  label: { fontSize: 12, fontWeight: '700', minWidth: 60, textAlign: 'right' },
});

export default function Step4Screen() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);

  const isValid = password.length >= 6 && password === confirmPassword;

  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleNext = () => {
    if (password.length < 6) {
      setError(t('onboarding.password_too_short'));
      shakeX.set(
        withSequence(
          withTiming(-10, { duration: 60 }),
          withTiming(10, { duration: 60 }),
          withTiming(-8, { duration: 60 }),
          withTiming(8, { duration: 60 }),
          withTiming(0, { duration: 60 })
        )
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(t('onboarding.password_mismatch'));
      shakeX.set(
        withSequence(
          withTiming(-10, { duration: 60 }),
          withTiming(10, { duration: 60 }),
          withTiming(-8, { duration: 60 }),
          withTiming(8, { duration: 60 }),
          withTiming(0, { duration: 60 })
        )
      );
      return;
    }
    setError('');
    router.push('/(onboarding)/step5');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={4} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={28} color="#6366f1" />
              </View>
              <Text style={styles.title}>{t('onboarding.password_title')}</Text>
              <Text style={styles.subtitle}>
                Hesabını korumak için en az 6 karakterli güçlü bir şifre oluştur.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(180).springify()} style={shakeStyle}>
              <View style={[styles.inputContainer, focused1 && styles.inputFocused]}>
                <Ionicons name="lock-closed-outline" size={22} color={focused1 ? '#6366f1' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.password_placeholder')}
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => { setPassword(val); setError(''); }}
                  onFocus={() => setFocused1(true)}
                  onBlur={() => setFocused1(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              <PasswordStrengthBar password={password} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(260).springify()} style={{ marginTop: 16 }}>
              <View style={[styles.inputContainer, focused2 && styles.inputFocused, password && confirmPassword && password === confirmPassword && styles.inputSuccess]}>
                <Ionicons name="shield-checkmark-outline" size={22} color={focused2 ? '#6366f1' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.confirm_password_placeholder')}
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={(val) => { setConfirmPassword(val); setError(''); }}
                  onFocus={() => setFocused2(true)}
                  onBlur={() => setFocused2(false)}
                />
                {password && confirmPassword && password === confirmPassword && (
                  <Animated.View entering={FadeIn.duration(300)}>
                    <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                  </Animated.View>
                )}
              </View>
            </Animated.View>

            {error ? (
              <Animated.Text entering={FadeIn} style={styles.errorText}>
                ⚠ {error}
              </Animated.Text>
            ) : null}
          </View>

          <Animated.View entering={FadeInDown.delay(340).springify()}>
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
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#eeeffe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
  },
  inputFocused: {
    borderColor: '#6366f1',
    backgroundColor: '#f5f3ff',
    borderWidth: 2,
  },
  inputSuccess: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
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
    marginTop: 12,
    fontWeight: '600',
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
