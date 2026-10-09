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
import { useOnboarding } from '@/context/OnboardingContext';

const NAME_SUGGESTIONS = ['Zeynep', 'Elif', 'Ayşe', 'Mehmet', 'Ali', 'Can', 'Berk', 'Ece'];

export default function Step6Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
  const isValid = firstName.trim().length > 1 && nameRegex.test(firstName.trim());

  const shakeX = useSharedValue(0);
  const inputBorderAnim = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const inputStyle = useAnimatedStyle(() => ({
    borderColor: inputBorderAnim.value === 1 ? '#6366f1' : '#e2e8f0',
    borderWidth: inputBorderAnim.value === 1 ? 2 : 1.5,
  }));

  const handleNext = () => {
    if (!nameRegex.test(firstName.trim()) || firstName.trim().length < 2) {
      setError(t('onboarding.name_invalid'));
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
    updateProfile({ firstName: firstName.trim() });
    router.push('/(onboarding)/step7');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={6} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.iconCircle}>
                <Ionicons name="person" size={28} color="#6366f1" />
              </View>
              <Text style={styles.title}>{t('onboarding.name_title')}</Text>
              <Text style={styles.subtitle}>
                Diğer öğrencilerin seni tanıması için sadece ilk adını gir.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(180).springify()} style={shakeStyle}>
              <Animated.View style={[styles.inputContainer, inputStyle]}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={focused ? '#6366f1' : '#94a3b8'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.name_placeholder')}
                  placeholderTextColor="#94a3b8"
                  value={firstName}
                  onChangeText={(val) => {
                    setFirstName(val);
                    setError('');
                  }}
                  onFocus={() => {
                    setFocused(true);
                    inputBorderAnim.set(withTiming(1, { duration: 200 }));
                  }}
                  onBlur={() => {
                    setFocused(false);
                    inputBorderAnim.set(withTiming(0, { duration: 200 }));
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {isValid && (
                  <Animated.View entering={FadeIn.duration(300)}>
                    <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                  </Animated.View>
                )}
              </Animated.View>
            </Animated.View>

            {error ? (
              <Animated.Text entering={FadeIn} style={styles.errorText}>
                ⚠ {error}
              </Animated.Text>
            ) : null}

            {/* Live preview */}
            {firstName.trim().length > 1 && isValid && (
              <Animated.View entering={FadeInDown.springify()} style={styles.previewCard}>
                <Text style={styles.previewLabel}>Merhaba!</Text>
                <Text style={styles.previewName}>👋 {firstName.trim()}</Text>
              </Animated.View>
            )}

            {/* Quick suggestions */}
            <Animated.View entering={FadeInDown.delay(250).springify()}>
              <Text style={styles.suggestLabel}>Hızlı seçim:</Text>
              <View style={styles.suggestRow}>
                {NAME_SUGGESTIONS.slice(0, 6).map((name) => (
                  <TouchableOpacity
                    key={name}
                    style={styles.suggestPill}
                    onPress={() => {
                      setFirstName(name);
                      setError('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestText}>{name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
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
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#eeeffe',
    padding: 16,
    borderRadius: 18,
    marginTop: 16,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  previewName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4f46e5',
  },
  suggestLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  suggestText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
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
