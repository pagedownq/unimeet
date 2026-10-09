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

const GENDER_OPTIONS = [
  {
    id: 'Kadın',
    labelKey: 'onboarding.gender_female',
    icon: 'woman' as const,
    color: '#ec4899',
    bg: '#fce7f3',
    emoji: '👩',
  },
  {
    id: 'Erkek',
    labelKey: 'onboarding.gender_male',
    icon: 'man' as const,
    color: '#3b82f6',
    bg: '#eff6ff',
    emoji: '👨',
  },
  {
    id: 'Diğer',
    labelKey: 'onboarding.gender_other',
    icon: 'transgender-outline' as const,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    emoji: '🧑',
  },
];

export default function Step9Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [gender, setGender] = useState<string>(profile.gender || '');

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleNext = () => {
    if (!gender) return;
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    updateProfile({ gender });
    router.push('/(onboarding)/step10');
  };

  const selectedOption = GENDER_OPTIONS.find((o) => o.id === gender);

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={9} />
      <View style={styles.container}>
        <View>
          <Animated.View entering={FadeInDown.delay(80).springify()}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-circle" size={30} color="#8b5cf6" />
            </View>
            <Text style={styles.title}>{t('onboarding.gender_title')}</Text>
            <Text style={styles.subtitle}>Cinsiyetin profilinde açıkça gösterilecektir.</Text>
          </Animated.View>

          <View style={styles.optionsList}>
            {GENDER_OPTIONS.map((item, index) => {
              const isSelected = gender === item.id;
              return (
                <Animated.View key={item.id} entering={ZoomIn.delay(100 + index * 80).springify()}>
                  <TouchableOpacity
                    style={[
                      styles.optionCard,
                      isSelected && {
                        borderColor: item.color,
                        backgroundColor: item.bg,
                        shadowColor: item.color,
                        shadowOpacity: 0.12,
                      },
                    ]}
                    onPress={() => setGender(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.leftRow}>
                      <View style={[
                        styles.emojiBox,
                        isSelected && { backgroundColor: item.color + '20' },
                      ]}>
                        <Text style={styles.emoji}>{item.emoji}</Text>
                      </View>
                      <View>
                        <Text style={[
                          styles.optionText,
                          isSelected && { color: item.color, fontWeight: '800' },
                        ]}>
                          {t(item.labelKey)}
                        </Text>
                        <Text style={styles.optionSubtext}>{item.id}</Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <Animated.View entering={ZoomIn.springify()}>
                        <View style={[styles.checkCircle, { backgroundColor: item.color }]}>
                          <Ionicons name="checkmark" size={16} color="#ffffff" />
                        </View>
                      </Animated.View>
                    ) : (
                      <View style={styles.emptyCircle} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        <Animated.View style={btnStyle}>
          <TouchableOpacity
            style={[styles.nextBtn, !gender && styles.disabledBtn]}
            onPress={handleNext}
            disabled={!gender}
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
    backgroundColor: '#f5f3ff',
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
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emojiBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 26 },
  optionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
  },
  optionSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  disabledBtn: {
    backgroundColor: '#c7d2fe',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
});
