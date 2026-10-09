import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboarding } from '@/context/OnboardingContext';

const SUMMARY_ITEMS = [
  { key: 'email', label: 'E-posta', icon: 'mail' as const, color: '#6366f1' },
  { key: 'firstName', label: 'İsim', icon: 'person' as const, color: '#10b981' },
  { key: 'gender', label: 'Cinsiyet', icon: 'transgender-outline' as const, color: '#ec4899' },
  { key: 'age', label: 'Yaş', icon: 'calendar' as const, color: '#f59e0b' },
  { key: 'universityName', label: 'Üniversite', icon: 'school' as const, color: '#0ea5e9' },
];

export default function Step14Screen() {
  const { t } = useTranslation();
  const { profile, completeOnboarding } = useOnboarding();

  const confettiScale = useSharedValue(0);
  const ringScale = useSharedValue(1);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: 1 - (ringScale.value - 1) * 2,
  }));

  const handleFinish = async () => {
    confettiScale.set(withSpring(1, { damping: 12, stiffness: 100 }));
    ringScale.set(withRepeat(withTiming(1.5, { duration: 800, easing: Easing.out(Easing.ease) }), 2, false));
    await completeOnboarding();
    router.replace('/(tabs)/explore');
  };

  const uniName = profile.universityName || 'Üniversiten';

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={14} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <Animated.View entering={ZoomIn.delay(100).springify()} style={styles.heroSection}>
          <Animated.View style={[styles.outerRing, ringStyle]} />
          <View style={styles.iconCircle}>
            <Text style={styles.checkEmoji}>🎉</Text>
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
          Hazırsın!
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(280).springify()} style={styles.subtitle}>
          {profile.firstName ? `${profile.firstName}, profil bilgilerin ` : 'Profil bilgilerin '}
          tamamlandı. UniMeet dünyasına hoş geldin!
        </Animated.Text>

        {/* Profile Summary */}
        <Animated.View entering={FadeInDown.delay(340).springify()} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Profil Özeti</Text>
          {SUMMARY_ITEMS.map((item) => {
            const value = (profile as any)[item.key];
            if (!value) return null;
            return (
              <View key={item.key} style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{String(value)}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
            );
          })}
        </Animated.View>

        {/* University card */}
        <Animated.View entering={FadeInDown.delay(420).springify()} style={styles.uniBadgeCard}>
          <View style={styles.uniBadgeIconBox}>
            <Ionicons name="school" size={24} color="#059669" />
          </View>
          <View style={styles.uniBadgeInfo}>
            <Text style={styles.uniBadgeLabel}>Kayıtlı Üniversite</Text>
            <Text style={styles.uniBadgeText}>{uniName}</Text>
          </View>
        </Animated.View>

        {/* Auth CTAs */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.authButtons}>
          <TouchableOpacity
            style={[styles.authBtn, styles.googleBtn]}
            onPress={handleFinish}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={22} color="#4285F4" />
            <Text style={styles.googleBtnText}>{t('onboarding.continue_google')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authBtn, styles.appleBtn]}
            onPress={handleFinish}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-apple" size={22} color="#ffffff" />
            <Text style={styles.appleBtnText}>{t('onboarding.continue_apple')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authBtn, styles.primaryBtn]}
            onPress={handleFinish}
            activeOpacity={0.85}
          >
            <Ionicons name="rocket" size={22} color="#ffffff" />
            <Text style={styles.primaryBtnText}>UniMeet'e Başla</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Disclaimer */}
        <Animated.View entering={FadeInUp.delay(580)} style={styles.disclaimerCard}>
          <Ionicons name="shield-checkmark" size={16} color="#10b981" />
          <Text style={styles.disclaimerText}>{t('onboarding.final_auth_disclaimer')}</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 50,
    alignItems: 'center',
  },
  heroSection: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eeeffe',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  checkEmoji: { fontSize: 50 },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    gap: 14,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryInfo: { flex: 1 },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 1,
  },
  uniBadgeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#6ee7b7',
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
    gap: 14,
  },
  uniBadgeIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uniBadgeInfo: { flex: 1 },
  uniBadgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uniBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065f46',
    marginTop: 2,
  },
  authButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 20,
    gap: 12,
  },
  googleBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  googleBtnText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
  appleBtn: {
    backgroundColor: '#0f172a',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  appleBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  primaryBtn: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
});
