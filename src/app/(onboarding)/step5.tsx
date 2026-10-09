import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboarding } from '@/context/OnboardingContext';

const { width } = Dimensions.get('window');
const SLOT_SIZE = (width - 48 - 14) / 2;

export default function Step5Screen() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [photos, setPhotos] = useState<string[]>(
    profile.photos && profile.photos.length > 0 ? profile.photos : []
  );
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const btnScale = useSharedValue(1);

  const pickImage = async (targetIndex: number) => {
    if (photos.length >= 5 && targetIndex >= photos.length) {
      Alert.alert('Sınır Ulaşıldı', 'En fazla 5 fotoğraf ekleyebilirsiniz.');
      return;
    }

    setLoadingIndex(targetIndex);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.75,
        allowsEditing: true,
        aspect: [4, 5],
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUri = result.assets[0].uri;
        setPhotos((prev) => {
          const updated = [...prev];
          if (targetIndex < updated.length) {
            updated[targetIndex] = newUri;
          } else {
            updated.push(newUri);
          }
          return updated;
        });
        setError('');
      }
    } catch (e) {
      console.warn('Image pick error:', e);
    } finally {
      setLoadingIndex(null);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (photos.length === 0) {
      setError(t('onboarding.photo_required'));
      return;
    }
    btnScale.set(withSequence(withSpring(0.94), withSpring(1)));
    updateProfile({ photos });
    router.push('/(onboarding)/step6');
  };

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader currentStep={5} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.iconCircle}>
            <Ionicons name="images" size={28} color="#10b981" />
          </View>
          <Text style={styles.title}>{t('onboarding.photos_title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.photos_subtitle')}</Text>
        </Animated.View>

        {/* Tip card */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
          <Text style={styles.tipText}>
            İlk fotoğrafın profil fotoğrafın olacak. Gülümseyen, net bir fotoğraf seç!
          </Text>
        </Animated.View>

        <View style={styles.grid}>
          {Array.from({ length: 5 }).map((_, index) => {
            const uri = photos[index];
            const isMain = index === 0;
            const isLoading = loadingIndex === index;

            return (
              <Animated.View
                key={index}
                entering={ZoomIn.delay(index * 80).springify()}
                style={[styles.slot, isMain && styles.mainSlot]}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text style={styles.loadingText}>Yükleniyor...</Text>
                  </View>
                ) : uri ? (
                  <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={() => pickImage(index)}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri }} style={styles.image} />
                    {isMain && (
                      <Animated.View entering={FadeIn.delay(200)} style={styles.mainBadge}>
                        <Ionicons name="star" size={12} color="#ffffff" />
                        <Text style={styles.mainBadgeText}>Ana Fotoğraf</Text>
                      </Animated.View>
                    )}
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => removePhoto(index)}>
                      <Ionicons name="close" size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.addBtn} onPress={() => pickImage(index)}>
                    <View style={[styles.addIconBox, isMain && styles.addIconBoxMain]}>
                      <Ionicons name="add" size={28} color={isMain ? '#6366f1' : '#94a3b8'} />
                    </View>
                    <Text style={[styles.addText, isMain && styles.addTextMain]}>
                      {isMain ? 'Ana Fotoğraf' : 'Ekle'}
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Photo count indicator */}
        <Animated.View entering={FadeIn.delay(500)} style={styles.countRow}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.countDot,
                i < photos.length && styles.countDotActive,
              ]}
            />
          ))}
          <Text style={styles.countText}>{photos.length}/5 fotoğraf</Text>
        </Animated.View>

        {error ? (
          <Animated.Text entering={FadeIn} style={styles.errorText}>
            ⚠ {error}
          </Animated.Text>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={btnStyle}>
          <TouchableOpacity
            style={[styles.nextBtn, photos.length === 0 && styles.disabledBtn]}
            onPress={handleNext}
            disabled={photos.length === 0}
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
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
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 19,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE * 1.2,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  mainSlot: {
    width: '100%',
    height: 260,
    borderStyle: 'solid',
    borderColor: '#6366f1',
    borderWidth: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  mainBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconBoxMain: {
    backgroundColor: '#eeeffe',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  addText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12,
  },
  addTextMain: {
    color: '#6366f1',
    fontSize: 14,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    justifyContent: 'center',
  },
  countDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  countDotActive: {
    backgroundColor: '#6366f1',
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginLeft: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
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
