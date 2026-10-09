import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const CAROUSEL_ITEMS = [
  {
    id: 1,
    icon: 'school-outline' as const,
    title: 'Kampüs Hayatı',
    desc: 'Kendi kampüsünden gerçek öğrencilerle tanış, ortak dersleri ve etkinlikleri keşfet.',
    badge: 'Kampüs',
    color: '#6366f1',
    bg: '#eeeffe',
  },
  {
    id: 2,
    icon: 'people-outline' as const,
    title: 'Aktivite & Sohbet',
    desc: 'Birlikte kitap okuma, kahve, spor — ortak ilgi alanlarıyla başlayan arkadaşlıklar.',
    badge: 'Sosyal',
    color: '#ec4899',
    bg: '#fce7f3',
  },
  {
    id: 3,
    icon: 'shield-checkmark-outline' as const,
    title: '.edu Doğrulaması',
    desc: 'Sadece gerçek öğrenci e-postalarıyla kayıt. Güvenli ve doğrulanmış bir topluluk.',
    badge: 'Güvenli',
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    id: 4,
    icon: 'sparkles-outline' as const,
    title: 'Dinamik Kartlar',
    desc: 'Tinder tarzı kaydırma ile profillerini keşfet. Sağa beğen, sola geç — çok kolay!',
    badge: 'Keşfet',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    id: 5,
    icon: 'rocket-outline' as const,
    title: 'Başlamaya Hazır!',
    desc: 'UniMeet ile kampüs hayatın çok daha renkli olacak. Hadi başlayalım!',
    badge: 'Hadi!',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
];

export default function Step2Screen() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const btnScale = useSharedValue(1);

  const currentItem = CAROUSEL_ITEMS[activeIndex];

  const handleNext = () => {
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    if (activeIndex < CAROUSEL_ITEMS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      router.push('/(onboarding)/step3');
    }
  };

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={2} />
      <View style={styles.container}>
        <Animated.Text entering={FadeInDown.delay(50)} style={styles.headerSubtitle}>
          Kampüsünden öğrencilerle tanışmaya ne dersin?
        </Animated.Text>

        <View style={styles.cardContainer}>
          <Animated.View
            key={currentItem.id}
            entering={FadeInRight.duration(350).springify()}
            exiting={FadeOutLeft.duration(250)}
            style={[styles.card, { borderColor: currentItem.color + '40', backgroundColor: '#ffffff' }]}
          >
            {/* Top colored band */}
            <View style={[styles.topBand, { backgroundColor: currentItem.color }]} />

            <View style={styles.cardBody}>
              <View style={[styles.badge, { backgroundColor: currentItem.bg }]}>
                <Text style={[styles.badgeText, { color: currentItem.color }]}>
                  ✦ {currentItem.badge}
                </Text>
              </View>

              <View style={[styles.iconBox, { backgroundColor: currentItem.bg }]}>
                <Ionicons name={currentItem.icon} size={68} color={currentItem.color} />
              </View>

              <Text style={styles.cardTitle}>{currentItem.title}</Text>
              <Text style={styles.cardDesc}>{currentItem.desc}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Indicators */}
        <View style={styles.pagination}>
          {CAROUSEL_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActiveIndex(index)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.dot,
                  index === activeIndex && [
                    styles.activeDot,
                    { backgroundColor: currentItem.color },
                  ],
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View style={[styles.footer, btnStyle]}>
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: currentItem.color, shadowColor: currentItem.color },
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>
              {activeIndex === CAROUSEL_ITEMS.length - 1 ? t('onboarding.start_btn') : t('common.next')}
            </Text>
            <Ionicons
              name={activeIndex === CAROUSEL_ITEMS.length - 1 ? 'rocket-outline' : 'arrow-forward'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginVertical: 8,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 40,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  topBand: {
    height: 6,
    width: '100%',
  },
  cardBody: {
    padding: 28,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  iconBox: {
    width: 116,
    height: 116,
    borderRadius: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  cardDesc: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 23,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e2e8f0',
  },
  activeDot: {
    width: 30,
    borderRadius: 5,
  },
  footer: {
    width: '100%',
  },
  ctaBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
});
