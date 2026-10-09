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

const INTEREST_TAGS = [
  { tag: 'Spor', emoji: '⚽' }, { tag: 'Teknoloji', emoji: '💻' },
  { tag: 'Sinema', emoji: '🎬' }, { tag: 'Gaming', emoji: '🎮' },
  { tag: 'Kahve', emoji: '☕' }, { tag: 'Sanat', emoji: '🎨' },
  { tag: 'Müzik', emoji: '🎵' }, { tag: 'Seyahat', emoji: '✈️' },
  { tag: 'Fitness', emoji: '💪' }, { tag: 'Fotoğrafçılık', emoji: '📷' },
  { tag: 'Kitap', emoji: '📚' }, { tag: 'Yemek', emoji: '🍕' },
  { tag: 'Dans', emoji: '💃' }, { tag: 'Moda', emoji: '👗' },
  { tag: 'Anime', emoji: '🎌' }, { tag: 'Kamp', emoji: '⛺' },
  { tag: 'Kodlama', emoji: '⌨️' }, { tag: 'Tasarım', emoji: '✏️' },
  { tag: 'Bilim', emoji: '🔬' }, { tag: 'Tarih', emoji: '🏛️' },
  { tag: 'Doğa', emoji: '🌿' }, { tag: 'Yoga', emoji: '🧘' },
  { tag: 'Basketbol', emoji: '🏀' }, { tag: 'Futbol', emoji: '⚽' },
  { tag: 'Satranç', emoji: '♟️' }, { tag: 'Podcast', emoji: '🎙️' },
  { tag: 'Gitar', emoji: '🎸' }, { tag: 'Piyano', emoji: '🎹' },
  { tag: 'Resim', emoji: '🖼️' }, { tag: 'Edebiyat', emoji: '📖' },
];

export default function Step12Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.interests || []
  );

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== tag));
    } else {
      if (selectedInterests.length >= 5) return;
      setSelectedInterests((prev) => [...prev, tag]);
    }
  };

  const isValid = selectedInterests.length > 0;

  const handleNext = () => {
    if (!isValid) return;
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    updateProfile({ interests: selectedInterests });
    router.push('/(onboarding)/step13');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={12} />
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart-circle" size={30} color="#6366f1" />
          </View>
          <Text style={styles.title}>{t('onboarding.interests_title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.interests_subtitle')}</Text>
        </Animated.View>

        {/* Counter */}
        <Animated.View entering={FadeInDown.delay(140).springify()} style={styles.counterRow}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.counterDot, i < selectedInterests.length && styles.counterDotActive]} />
          ))}
          <Text style={styles.counterText}>{selectedInterests.length}/5 seçildi</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.tagGrid} showsVerticalScrollIndicator={false}>
          {INTEREST_TAGS.map(({ tag, emoji }, index) => {
            const isSelected = selectedInterests.includes(tag);
            const isDisabled = !isSelected && selectedInterests.length >= 5;
            return (
              <Animated.View key={tag} entering={ZoomIn.delay(index * 30).springify()}>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    isSelected && styles.selectedTag,
                    isDisabled && styles.disabledTag,
                  ]}
                  onPress={() => toggleInterest(tag)}
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
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: '#eeeffe', justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 10 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  counterDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e2e8f0' },
  counterDotActive: { backgroundColor: '#6366f1' },
  counterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 110 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: '#e2e8f0',
  },
  selectedTag: { backgroundColor: '#6366f1', borderColor: '#4f46e5' },
  disabledTag: { opacity: 0.4 },
  tagEmoji: { fontSize: 16 },
  tagText: { fontSize: 14, fontWeight: '700', color: '#334155' },
  selectedTagText: { color: '#ffffff' },
  footer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  nextBtn: {
    backgroundColor: '#6366f1', paddingVertical: 18, borderRadius: 20,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10,
    shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  disabledBtn: { backgroundColor: '#c7d2fe', shadowOpacity: 0, elevation: 0 },
  nextBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
});
