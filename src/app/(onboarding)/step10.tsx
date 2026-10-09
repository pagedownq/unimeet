import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
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

const TARGET_GENDERS = [
  { id: 'Kadın', labelKey: 'onboarding.gender_female', icon: 'woman' as const, color: '#ec4899', bg: '#fce7f3', emoji: '👩' },
  { id: 'Erkek', labelKey: 'onboarding.gender_male', icon: 'man' as const, color: '#3b82f6', bg: '#eff6ff', emoji: '👨' },
  { id: 'Diğer', labelKey: 'onboarding.gender_other', icon: 'transgender-outline' as const, color: '#8b5cf6', bg: '#f5f3ff', emoji: '🧑' },
];

export default function Step10Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    profile.targetGenders || ['Erkek']
  );

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const toggleTarget = (id: string) => {
    if (selectedGenders.includes(id)) {
      if (selectedGenders.length === 1) return;
      setSelectedGenders((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedGenders((prev) => [...prev, id]);
    }
  };

  const handleNext = () => {
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    updateProfile({ targetGenders: selectedGenders });
    router.push('/(onboarding)/step11');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={10} />
      <View style={styles.container}>
        <View>
          <Animated.View entering={FadeInDown.delay(80).springify()}>
            <View style={styles.iconCircle}>
              <Ionicons name="search" size={28} color="#6366f1" />
            </View>
            <Text style={styles.title}>{t('onboarding.target_gender_title')}</Text>
            <Text style={styles.subtitle}>
              Keşfet ekranında karşına çıkacak öğrenci profillerini belirle. (Birden fazla seçilebilir)
            </Text>
          </Animated.View>

          <View style={styles.optionsList}>
            {TARGET_GENDERS.map((item, index) => {
              const isSelected = selectedGenders.includes(item.id);
              return (
                <Animated.View key={item.id} entering={ZoomIn.delay(100 + index * 80).springify()}>
                  <TouchableOpacity
                    style={[
                      styles.optionCard,
                      isSelected && {
                        borderColor: item.color,
                        backgroundColor: item.bg,
                      },
                    ]}
                    onPress={() => toggleTarget(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.leftRow}>
                      <View style={[styles.emojiBox, isSelected && { backgroundColor: item.color + '20' }]}>
                        <Text style={styles.emoji}>{item.emoji}</Text>
                      </View>
                      <Text style={[styles.optionText, isSelected && { color: item.color, fontWeight: '800' }]}>
                        {t(item.labelKey)}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Animated.View entering={ZoomIn.springify()}>
                        <View style={[styles.checkBox, { backgroundColor: item.color }]}>
                          <Ionicons name="checkmark" size={16} color="#ffffff" />
                        </View>
                      </Animated.View>
                    ) : (
                      <View style={styles.emptyBox} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
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
    backgroundColor: '#eeeffe',
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
    marginBottom: 28,
  },
  optionsList: { gap: 14 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emojiBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 26 },
  optionText: { fontSize: 17, fontWeight: '700', color: '#334155' },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
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
  nextBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
});
