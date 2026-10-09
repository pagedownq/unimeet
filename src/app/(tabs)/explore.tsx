import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MOCK_STUDENTS, StudentCard } from '@/data/mockData';
import {
  getSwipeLimitState,
  decrementSwipeCount,
  formatTimeRemaining,
  MAX_SWIPES,
  SwipeLimitState,
} from '@/services/swipeLimitService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function ExploreScreen() {
  const { t } = useTranslation();
  const [cards] = useState<StudentCard[]>(MOCK_STUDENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Lazy state initialization for React purity
  const [swipeState, setSwipeState] = useState<SwipeLimitState>(() => ({
    remainingSwipes: MAX_SWIPES,
    resetTimestamp: Date.now() + 12 * 60 * 60 * 1000,
  }));
  const [timeRemaining, setTimeRemaining] = useState<string>('12:00:00');
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);

  // Reanimated shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;

    getSwipeLimitState().then((state) => {
      if (isMounted) {
        setSwipeState(state);
        if (state.remainingSwipes <= 0) {
          setShowLimitModal(true);
        }
      }
    });

    const interval = setInterval(() => {
      getSwipeLimitState().then((state) => {
        if (!isMounted) return;
        const diff = state.resetTimestamp - Date.now();
        if (diff <= 0) {
          setSwipeState(state);
          setShowLimitModal(false);
        } else {
          setTimeRemaining(formatTimeRemaining(diff));
          if (state.remainingSwipes <= 0) {
            setShowLimitModal(true);
          }
        }
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSwipeComplete = useCallback(() => {
    decrementSwipeCount().then((updated) => {
      setSwipeState(updated);
      if (updated.remainingSwipes <= 0) {
        setShowLimitModal(true);
      }
    });

    translateX.set(0);
    translateY.set(0);
    setActivePhotoIndex(0);
    setCurrentIndex((prev) => prev + 1);
  }, [translateX, translateY]);

  const panGesture = Gesture.Pan()
    .enabled(swipeState.remainingSwipes > 0)
    .onUpdate((event) => {
      translateX.set(event.translationX);
      translateY.set(event.translationY);
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.set(
          withSpring(SCREEN_WIDTH * 1.5, {}, () => {
            runOnJS(handleSwipeComplete)();
          })
        );
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.set(
          withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
            runOnJS(handleSwipeComplete)();
          })
        );
      } else {
        translateX.set(withSpring(0));
        translateY.set(withSpring(0));
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const currentCard = cards[currentIndex];

  const handlePhotoPress = (evt: any) => {
    if (!currentCard) return;
    const xLocation = evt.nativeEvent.locationX;
    const photoWidth = SCREEN_WIDTH - 28;

    if (xLocation < photoWidth * 0.4) {
      // Previous photo
      setActivePhotoIndex((prev) => Math.max(0, prev - 1));
    } else {
      // Next photo
      setActivePhotoIndex((prev) => Math.min(currentCard.photos.length - 1, prev + 1));
    }
  };

  const resetCards = () => {
    setActivePhotoIndex(0);
    setCurrentIndex(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sleek Header */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoIconBg}>
            <Ionicons name="flame" size={22} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>UniMeet</Text>
        </View>

        {/* Glassmorphism Swipe Limit Badge */}
        <TouchableOpacity style={styles.limitBadge} onPress={() => setShowLimitModal(true)}>
          <Ionicons name="sparkles" size={16} color="#6366f1" />
          <Text style={styles.limitBadgeText}>
            {swipeState.remainingSwipes} / {MAX_SWIPES}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {currentCard ? (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cardScrollContent}
                nestedScrollEnabled
              >
                {/* 1. Full Photo Container (Initial View - Only Photo & Name Overlay) */}
                <Pressable onPress={handlePhotoPress} style={styles.photoContainer}>
                  <Image
                    source={{ uri: currentCard.photos[activePhotoIndex] || currentCard.photos[0] }}
                    style={styles.mainPhoto}
                  />

                  {/* Story Segment Bars */}
                  {currentCard.photos.length > 1 && (
                    <View style={styles.storySegmentContainer}>
                      {currentCard.photos.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.storySegment,
                            index === activePhotoIndex && styles.activeStorySegment,
                          ]}
                        />
                      ))}
                    </View>
                  )}

                  {/* Distance Glass Pill */}
                  <View style={styles.distancePill}>
                    <Ionicons name="location" size={12} color="#ffffff" />
                    <Text style={styles.distancePillText}>{currentCard.distanceKm} km yakınında</Text>
                  </View>

                  {/* Photo Gradient Overlay & Info */}
                  <View style={styles.photoGradient}>
                    <View style={styles.nameRow}>
                      <Text style={styles.cardName}>
                        {currentCard.name}, {currentCard.age}
                      </Text>
                    </View>
                    <View style={styles.uniTag}>
                      <Ionicons name="school" size={14} color="#ffffff" />
                      <Text style={styles.uniTagText}>{currentCard.university}</Text>
                    </View>

                    {/* Scroll Down Hint Pill */}
                    <View style={styles.scrollHintPill}>
                      <Text style={styles.scrollHintText}>Detaylar için aşağı kaydır</Text>
                      <Ionicons name="chevron-down" size={16} color="#ffffff" />
                    </View>
                  </View>
                </Pressable>

                {/* BELOW THE FOLD DETAILS: Shown when scrolling down */}
                <View style={styles.detailsContainer}>
                  {/* 2. Buluşma Amacı Tags */}
                  <View style={styles.cardSection}>
                    <Text style={styles.sectionHeading}>Buluşma Amacı</Text>
                    <View style={styles.tagWrap}>
                      {currentCard.intent.map((item) => (
                        <View key={item} style={styles.intentChip}>
                          <Ionicons name="sparkles" size={14} color="#6366f1" />
                          <Text style={styles.intentChipText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* 3. Bio (Hakkımda) */}
                  <View style={styles.cardSection}>
                    <Text style={styles.sectionHeading}>{t('profile.about_me')}</Text>
                    <Text style={styles.bioText}>{currentCard.bio}</Text>
                  </View>

                  {/* 4. Secondary Photos Horizontal Scroll */}
                  {currentCard.photos.length > 1 && (
                    <View style={styles.cardSection}>
                      <Text style={styles.sectionHeading}>Fotoğraf Galerisi</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosRow}>
                        {currentCard.photos.map((uri, idx) => (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => setActivePhotoIndex(idx)}
                            style={[
                              styles.secondaryPhotoWrapper,
                              idx === activePhotoIndex && styles.activeSecondaryWrapper,
                            ]}
                          >
                            <Image source={{ uri }} style={styles.secondaryPhoto} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* 5. Interests & Traits Badges */}
                  <View style={styles.cardSection}>
                    <Text style={styles.sectionHeading}>İlgi Alanları & Özellikler</Text>
                    <View style={styles.tagWrap}>
                      {currentCard.interests.map((tag) => (
                        <View key={tag} style={styles.interestTag}>
                          <Text style={styles.interestTagText}>#{tag}</Text>
                        </View>
                      ))}
                      {currentCard.traits.map((trait) => (
                        <View key={trait} style={styles.traitTag}>
                          <Text style={styles.traitTagText}>✨ {trait}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        ) : (
          /* Empty Card State */
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles" size={64} color="#6366f1" />
            <Text style={styles.emptyTitle}>{t('swipe.no_more_cards')}</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={resetCards}>
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.refreshBtnText}>{t('swipe.refresh')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Swipe Limit Reached Modal */}
      <Modal visible={showLimitModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="time-outline" size={48} color="#6366f1" />
            </View>

            <Text style={styles.modalTitle}>{t('swipe.limit_reached')}</Text>
            <Text style={styles.modalSubtitle}>
              Günde en fazla {MAX_SWIPES} swipe hakkınız bulunmaktadır.
            </Text>

            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>Yenilenme Süresi</Text>
              <Text style={styles.timerValue}>{timeRemaining}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowLimitModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBg: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeffe',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  limitBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4f46e5',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cardContainer: {
    width: SCREEN_WIDTH - 24,
    height: SCREEN_HEIGHT * 0.74,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardScrollContent: {
    flexGrow: 1,
  },
  photoContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.73,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storySegmentContainer: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 6,
    zIndex: 20,
  },
  storySegment: {
    flex: 1,
    height: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  activeStorySegment: {
    backgroundColor: '#ffffff',
  },
  distancePill: {
    position: 'absolute',
    top: 26,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    zIndex: 20,
  },
  distancePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  uniTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  uniTagText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  scrollHintText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 30,
  },
  cardSection: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeffe',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  intentChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4f46e5',
  },
  bioText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 23,
    fontWeight: '400',
  },
  photosRow: {
    gap: 12,
  },
  secondaryPhotoWrapper: {
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeSecondaryWrapper: {
    borderColor: '#6366f1',
  },
  secondaryPhoto: {
    width: '100%',
    height: '100%',
  },
  interestTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  interestTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  traitTag: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  traitTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#be185d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  refreshBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eeeffe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerCard: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6366f1',
    marginTop: 4,
  },
  modalCloseBtn: {
    width: '100%',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
