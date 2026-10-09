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

const TRAIT_TAGS = [
  { tag: 'Eğlenceli', emoji: '😄' }, { tag: 'Hırslı', emoji: '🔥' },
  { tag: 'Dışadönük', emoji: '🎉' }, { tag: 'Sakin', emoji: '🌊' },
  { tag: 'Yaratıcı', emoji: '🎨' }, { tag: 'İyi Dinleyici', emoji: '👂' },
  { tag: 'Enerjik', emoji: '⚡' }, { tag: 'Empatik', emoji: '💜' },
  { tag: 'Dürüst', emoji: '✅' }, { tag: 'Zeki', emoji: '🧠' },
  { tag: 'Açık Fikirli', emoji: '🌍' }, { tag: 'Maceraperest', emoji: '🗺️' },
  { tag: 'Komik', emoji: '😂' }, { tag: 'Sempatik', emoji: '😊' },
  { tag: 'Kibar', emoji: '🌸' }, { tag: 'Sadık', emoji: '🤝' },
  { tag: 'Pozitif', emoji: '☀️' },
];

export default function Step13Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [selectedTraits, setSelectedTraits] = useState<string[]>(profile.traits || []);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const toggleTrait = (tag: string) => {
    if (selectedTraits.includes(tag)) {
      setSelectedTraits((prev) => prev.filter((item) => item !== tag));
    } else {
      if (selectedTraits.length >= 3) return;
      setSelectedTraits((prev) => [...prev, tag]);
    }
  };

  const handleNext = () => {
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    updateProfile({ traits: selectedTraits });
    router.push('/(onboarding)/step14');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={13} />
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={28} color="#ec4899" />
          </View>
          <Text style={styles.title}>{t('onboarding.traits_title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.traits_subtitle')}</Text>
        </Animated.View>

        {/* Counter */}
        <Animated.View entering={FadeInDown.delay(130).springify()} style={styles.counterRow}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={[styles.counterDot, i < selectedTraits.length && styles.counterDotActive]} />
          ))}
          <Text style={styles.counterText}>{selectedTraits.length}/3 seçildi</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.tagGrid} showsVerticalScrollIndicator={false}>
          {TRAIT_TAGS.map(({ tag, emoji }, index) => {
            const isSelected = selectedTraits.includes(tag);
            const isDisabled = !isSelected && selectedTraits.length >= 3;
            return (
              <Animated.View key={tag} entering={ZoomIn.delay(index * 40).springify()}>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    isSelected && styles.selectedTag,
                    isDisabled && styles.disabledTag,
                  ]}
                  onPress={() => toggleTrait(tag)}
                  activeOpacity={0.75}
                  disabled={isDisabled && !isSelected}
                >
                  <Text style={styles.tagEmoji}>{emoji}</Text>
                  <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>{tag}</Text>
                  {isSelected && (
                    <Animated.View entering={ZoomIn.springify()}>
                      <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
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
              style={styles.nextBtn}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>{t('common.next')}</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity style={styles.skipBtn} onPress={() => router.push('/(onboarding)/step14')}>
            <Text style={styles.skipBtnText}>{t('common.skip')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  iconCircle: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: '#fce7f3', justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 10 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  counterDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e2e8f0' },
  counterDotActive: { backgroundColor: '#ec4899' },
  counterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 120 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 22,
    backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: '#e2e8f0',
  },
  selectedTag: { backgroundColor: '#ec4899', borderColor: '#db2777' },
  disabledTag: { opacity: 0.4 },
  tagEmoji: { fontSize: 18 },
  tagText: { fontSize: 14, fontWeight: '700', color: '#334155' },
  selectedTagText: { color: '#ffffff' },
  footer: { position: 'absolute', bottom: 30, left: 20, right: 20, gap: 10 },
  nextBtn: {
    backgroundColor: '#6366f1', paddingVertical: 18, borderRadius: 20,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10,
    shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  nextBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  skipBtn: { paddingVertical: 10, alignItems: 'center' },
  skipBtnText: { color: '#94a3b8', fontSize: 15, fontWeight: '600' },
});
