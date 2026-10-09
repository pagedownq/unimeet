import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
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
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboarding } from '@/context/OnboardingContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 52;

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const START_YEAR = 1970;
const END_YEAR = new Date().getFullYear() - 16;
const ASCENDING_YEARS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, i) => START_YEAR + i
);

function WheelColumn({
  items,
  selectedIndex,
  onSelect,
  renderItem,
  color = '#6366f1',
}: {
  items: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  renderItem: (item: any) => string;
  color?: string;
}) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: true,
      });
    }, 200);
  }, []);

  return (
    <View style={wheelStyles.column}>
      {/* Selection highlight */}
      <View style={[wheelStyles.selectionHighlight, { borderColor: color + '30', backgroundColor: color + '10' }]} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={wheelStyles.scrollContent}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
          onSelect(clampedIndex);
        }}
      >
        {/* Padding so first item can be centered */}
        <View style={{ height: ITEM_HEIGHT }} />
        {items.map((item, i) => {
          const isSelected = i === selectedIndex;
          return (
            <TouchableOpacity
              key={i}
              style={[wheelStyles.item, isSelected && { ...wheelStyles.selectedItem, borderColor: color }]}
              onPress={() => {
                onSelect(i);
                scrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  wheelStyles.itemText,
                  isSelected && { ...wheelStyles.selectedItemText, color },
                ]}
                numberOfLines={1}
              >
                {renderItem(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: ITEM_HEIGHT }} />
      </ScrollView>
    </View>
  );
}

const wheelStyles = StyleSheet.create({
  column: {
    flex: 1,
    height: ITEM_HEIGHT * 5,
    position: 'relative',
    overflow: 'hidden',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    borderRadius: 14,
    borderWidth: 1.5,
    zIndex: 1,
    pointerEvents: 'none',
  },
  scrollContent: {
    paddingVertical: 0,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  selectedItem: {
    borderWidth: 0,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
  },
  selectedItemText: {
    fontSize: 17,
    fontWeight: '800',
  },
});

export default function Step7Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();

  const initialDate = profile.birthDate ? new Date(profile.birthDate) : new Date(2003, 4, 15);

  const [selectedDay, setSelectedDay] = useState<number>(initialDate.getDate() - 1); // 0-indexed
  const [selectedMonth, setSelectedMonth] = useState<number>(initialDate.getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState<number>(ASCENDING_YEARS.indexOf(initialDate.getFullYear()));
  const [error, setError] = useState('');

  const maxDaysInMonth = new Date(
    ASCENDING_YEARS[selectedYear] ?? END_YEAR,
    selectedMonth + 1,
    0
  ).getDate();
  const daysArray = Array.from({ length: maxDaysInMonth }, (_, i) => i + 1);

  const actualDay = Math.min(selectedDay, daysArray.length - 1);
  const actualYear = ASCENDING_YEARS[selectedYear] ?? END_YEAR;

  const calculateAge = (dayIdx: number, month: number, yearIdx: number) => {
    const y = ASCENDING_YEARS[yearIdx] ?? END_YEAR;
    const d = dayIdx + 1;
    const today = new Date();
    let age = today.getFullYear() - y;
    const mDiff = today.getMonth() - month;
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < d)) age--;
    return age;
  };

  const calculatedAge = calculateAge(actualDay, selectedMonth, selectedYear);
  const isValidAge = calculatedAge >= 16;

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleNext = () => {
    if (!isValidAge) {
      setError(t('onboarding.age_restriction'));
      return;
    }
    setError('');
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    const finalDate = new Date(actualYear, selectedMonth, actualDay + 1);
    updateProfile({ birthDate: finalDate.toISOString(), age: calculatedAge });
    router.push('/(onboarding)/step8');
  };

  const formattedDate = `${actualDay + 1} ${TURKISH_MONTHS[selectedMonth]} ${actualYear}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={7} />
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar" size={28} color="#0ea5e9" />
          </View>
          <Text style={styles.title}>{t('onboarding.birthdate_title')}</Text>
        </Animated.View>

        {/* Live display card */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.displayCard}>
          <View style={styles.displayLeft}>
            <Text style={styles.displayLabel}>Seçilen Tarih</Text>
            <Text style={styles.displayDate}>{formattedDate}</Text>
          </View>
          <View style={[
            styles.agePill,
            isValidAge ? styles.agePillValid : styles.agePillInvalid,
          ]}>
            <Text style={[styles.ageText, !isValidAge && { color: '#ef4444' }]}>
              {calculatedAge} yaş
            </Text>
          </View>
        </Animated.View>

        {!isValidAge && (
          <Animated.View entering={FadeIn} style={styles.warningCard}>
            <Ionicons name="warning" size={18} color="#ef4444" />
            <Text style={styles.warningText}>En az 16 yaşında olmalısınız.</Text>
          </Animated.View>
        )}

        {/* Wheel Picker */}
        <Animated.View entering={FadeInDown.delay(240).springify()} style={styles.wheelsWrapper}>
          {/* Headers */}
          <View style={styles.columnHeaders}>
            <Text style={[styles.colHeader, { color: '#6366f1' }]}>GÜN</Text>
            <Text style={[styles.colHeader, { color: '#0ea5e9' }]}>AY</Text>
            <Text style={[styles.colHeader, { color: '#8b5cf6' }]}>YIL</Text>
          </View>

          <View style={styles.wheelsRow}>
            <WheelColumn
              items={daysArray}
              selectedIndex={actualDay}
              onSelect={setSelectedDay}
              renderItem={(d) => String(d)}
              color="#6366f1"
            />
            <View style={styles.divider} />
            <WheelColumn
              items={TURKISH_MONTHS}
              selectedIndex={selectedMonth}
              onSelect={setSelectedMonth}
              renderItem={(m) => m}
              color="#0ea5e9"
            />
            <View style={styles.divider} />
            <WheelColumn
              items={ASCENDING_YEARS}
              selectedIndex={Math.max(0, selectedYear)}
              onSelect={setSelectedYear}
              renderItem={(y) => String(y)}
              color="#8b5cf6"
            />
          </View>
        </Animated.View>

        {/* Privacy note */}
        <Animated.View entering={FadeIn.delay(350)} style={styles.privacyCard}>
          <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" />
          <Text style={styles.privacyText}>{t('onboarding.age_privacy')}</Text>
        </Animated.View>

        {error ? (
          <Animated.Text entering={FadeIn} style={styles.errorText}>⚠ {error}</Animated.Text>
        ) : null}

        <Animated.View style={btnStyle}>
          <TouchableOpacity
            style={[styles.nextBtn, !isValidAge && styles.disabledBtn]}
            onPress={handleNext}
            disabled={!isValidAge}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  displayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f9ff',
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
  },
  displayLeft: {},
  displayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0ea5e9',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  displayDate: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0c4a6e',
    marginTop: 2,
  },
  agePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  agePillValid: {
    backgroundColor: '#e0f2fe',
  },
  agePillInvalid: {
    backgroundColor: '#fee2e2',
  },
  ageText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284c7',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 14,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
    flex: 1,
  },
  wheelsWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginVertical: 8,
  },
  columnHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  colHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  wheelsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 14,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
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
