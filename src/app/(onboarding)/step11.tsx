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

const BIO_SUGGESTIONS = [
  'Müzik ve kitap tutkunuyum 🎵',
  'Kampüste yeni arkadaşlar edinmek istiyorum 👋',
  'Kahve içmek ve sohbet etmek büyük keyif 🍵',
  'Yazılım öğrencisi, kod ve spor 💻',
];

const CHAR_LIMIT = 150;

export default function Step11Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [bio, setBio] = useState<string>(profile.bio || '');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const isValid = bio.trim().length > 0 && bio.length <= CHAR_LIMIT;
  const charPercent = Math.min((bio.length / CHAR_LIMIT) * 100, 100);
  const isNearLimit = bio.length >= CHAR_LIMIT * 0.85;

  const inputBorderAnim = useSharedValue(0);
  const inputBorderStyle = useAnimatedStyle(() => ({
    borderColor: inputBorderAnim.value === 1 ? '#6366f1' : '#e2e8f0',
    borderWidth: inputBorderAnim.value === 1 ? 2 : 1.5,
  }));

  const handleNext = () => {
    if (bio.trim().length === 0) {
      setError(t('onboarding.bio_required'));
      return;
    }
    setError('');
    updateProfile({ bio: bio.trim() });
    router.push('/(onboarding)/step12');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={11} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View>
            <Animated.View entering={FadeInDown.delay(80).springify()}>
              <View style={styles.iconCircle}>
                <Ionicons name="pencil" size={28} color="#f59e0b" />
              </View>
              <Text style={styles.title}>{t('onboarding.bio_title')}</Text>
              <Text style={styles.subtitle}>
                Diğer öğrencilerin dikkatini çekecek kısa ve öz bir şeyler yaz.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(160).springify()}>
              <Animated.View style={[styles.inputCard, inputBorderStyle]}>
                <TextInput
                  style={styles.textArea}
                  placeholder={t('onboarding.bio_placeholder')}
                  placeholderTextColor="#94a3b8"
                  multiline
                  maxLength={CHAR_LIMIT}
                  value={bio}
                  onChangeText={(text) => {
                    setBio(text);
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
                />
                {/* Char progress */}
                <View style={styles.counterRow}>
                  <View style={styles.charBarTrack}>
                    <View
                      style={[
                        styles.charBarFill,
                        {
                          width: `${charPercent}%` as any,
                          backgroundColor: isNearLimit ? '#ef4444' : '#6366f1',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.counterText, isNearLimit && { color: '#ef4444' }]}>
                    {bio.length}/{CHAR_LIMIT}
                  </Text>
                </View>
              </Animated.View>

              {error ? (
                <Animated.Text entering={FadeIn} style={styles.errorText}>⚠ {error}</Animated.Text>
              ) : null}
            </Animated.View>

            {/* Suggestions */}
            <Animated.View entering={FadeInDown.delay(240).springify()}>
              <Text style={styles.suggestLabel}>Hızlı fikirler:</Text>
              <View style={styles.suggestList}>
                {BIO_SUGGESTIONS.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestItem}
                    onPress={() => { setBio(s); setError(''); }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="bulb-outline" size={15} color="#f59e0b" />
                    <Text style={styles.suggestText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(320).springify()}>
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
    paddingTop: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#fffbeb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
  },
  textArea: {
    minHeight: 110,
    fontSize: 16,
    color: '#0f172a',
    textAlignVertical: 'top',
    fontWeight: '500',
    lineHeight: 24,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  charBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  charBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    minWidth: 46,
    textAlign: 'right',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
  },
  suggestLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 10,
  },
  suggestList: { gap: 8 },
  suggestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  suggestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    flex: 1,
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
  nextBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
});
