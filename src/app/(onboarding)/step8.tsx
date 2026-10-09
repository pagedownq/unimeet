import React, { useState } from 'react';
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
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboarding } from '@/context/OnboardingContext';

const INTENT_OPTIONS = [
  { id: 'Activity Partner', label: 'Aktivite Arkadaşı', icon: 'bicycle-outline' as const, color: '#10b981', bg: '#ecfdf5' },
  { id: 'Fun', label: 'Eğlence & Takılmaca', icon: 'sparkles-outline' as const, color: '#f59e0b', bg: '#fffbeb' },
  { id: 'Dating', label: 'Buluşma & Flört', icon: 'heart-outline' as const, color: '#ec4899', bg: '#fce7f3' },
  { id: 'Romance', label: 'Ciddi İlişki', icon: 'rose-outline' as const, color: '#f43f5e', bg: '#fff1f2' },
  { id: 'Chat', label: 'Sadece Sohbet', icon: 'chatbubbles-outline' as const, color: '#6366f1', bg: '#eeeffe' },
  { id: 'Events', label: 'Festival & Etkinlik', icon: 'ticket-outline' as const, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'Friend', label: 'Kampüs Arkadaşı', icon: 'people-outline' as const, color: '#0ea5e9', bg: '#e0f2fe' },
  { id: 'Travel', label: 'Seyahat & Gezi', icon: 'compass-outline' as const, color: '#06b6d4', bg: '#ecfeff' },
  { id: 'Party', label: 'Parti & Gece Hayatı', icon: 'wine-outline' as const, color: '#a855f7', bg: '#faf5ff' },
  { id: 'Study', label: 'Ders Çalışma', icon: 'book-outline' as const, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'Coffee', label: 'Kahve Molası', icon: 'cafe-outline' as const, color: '#92400e', bg: '#fef3c7' },
];

export default function Step8Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [selectedIntents, setSelectedIntents] = useState<string[]>(profile.intents || []);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const toggleIntent = (id: string) => {
    if (selectedIntents.includes(id)) {
      setSelectedIntents((prev) => prev.filter((item) => item !== id));
    } else {
      if (selectedIntents.length >= 3) return; // silently limit
      setSelectedIntents((prev) => [...prev, id]);
    }
  };

  const isValid = selectedIntents.length > 0;

  const handleNext = () => {
    if (!isValid) return;
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    updateProfile({ intents: selectedIntents });
    router.push('/(onboarding)/step9');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={8} />
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={28} color="#ec4899" />
          </View>
          <Text style={styles.title}>{t('onboarding.intent_title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.intent_subtitle')}</Text>
        </Animated.View>

        {/* Selection counter */}
        <Animated.View entering={FadeInDown.delay(140).springify()} style={styles.counterRow}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={[styles.counterDot, i < selectedIntents.length && styles.counterDotActive]} />
          ))}
          <Text style={styles.counterText}>{selectedIntents.length}/3 seçildi</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.chipGrid} showsVerticalScrollIndicator={false}>
          {INTENT_OPTIONS.map((item, index) => {
            const isSelected = selectedIntents.includes(item.id);
            const isDisabled = !isSelected && selectedIntents.length >= 3;
            return (
              <Animated.View
                key={item.id}
                entering={ZoomIn.delay(index * 50).springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.chip,
                    isSelected && { backgroundColor: item.color, borderColor: item.color },
                    !isSelected && { backgroundColor: item.bg, borderColor: item.color + '40' },
                    isDisabled && styles.disabledChip,
                  ]}
                  onPress={() => toggleIntent(item.id)}
                  activeOpacity={0.8}
                  disabled={isDisabled && !isSelected}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isSelected ? '#ffffff' : item.color}
                    style={styles.chipIcon}
                  />
                  <Text style={[styles.chipText, isSelected && styles.selectedChipText, { color: isSelected ? '#ffffff' : item.color }]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Animated.View entering={ZoomIn.springify()}>
                      <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Animated.View style={btnStyle}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#fce7f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 10 },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  counterDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  counterDotActive: {
    backgroundColor: '#ec4899',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 110,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  disabledChip: {
    opacity: 0.4,
  },
  chipIcon: {},
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
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
