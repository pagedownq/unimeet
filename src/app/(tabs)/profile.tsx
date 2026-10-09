import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '@/context/OnboardingContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, updateProfile, resetProfile } = useOnboarding();

  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const [bio, setBio] = useState(profile.bio || 'Kampüste yeni insanlarla tanışmak istiyorum!');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Calculate completion percentage dynamically
  const calculateCompletion = (): number => {
    let score = 0;
    if (profile.email) score += 10;
    if (profile.firstName) score += 15;
    if (profile.photos && profile.photos.length > 0) score += 20;
    if (profile.bio) score += 15;
    if (profile.intents && profile.intents.length > 0) score += 15;
    if (profile.interests && profile.interests.length > 0) score += 15;
    if (profile.traits && profile.traits.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const completionRate = calculateCompletion();

  const userPhotos =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'];

  const mainPhoto = userPhotos[0];

  const handlePickPhoto = async () => {
    if (profile.photos.length >= 5) {
      Alert.alert('Sınır', 'En fazla 5 fotoğraf ekleyebilirsiniz.');
      return;
    }
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as ImagePicker.MediaTypeOptions[],
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const updatedPhotos = [...profile.photos, result.assets[0].uri];
      updateProfile({ photos: updatedPhotos });
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (profile.photos.length <= 1) {
      Alert.alert('Hata', 'En az 1 profil fotoğrafı tutmalısınız.');
      return;
    }
    const updated = profile.photos.filter((_, i) => i !== index);
    updateProfile({ photos: updated });
  };

  const handleSaveBio = () => {
    updateProfile({ bio: bio.trim() });
    setIsEditingBio(false);
  };

  const handlePreviewPhotoPress = (evt: any) => {
    const xLocation = evt.nativeEvent.locationX;
    const photoWidth = SCREEN_WIDTH - 40;

    if (xLocation < photoWidth * 0.4) {
      setActivePhotoIndex((prev) => Math.max(0, prev - 1));
    } else {
      setActivePhotoIndex((prev) => Math.min(userPhotos.length - 1, prev + 1));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>{t('tabs.profile')}</Text>
        <TouchableOpacity onPress={resetProfile} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Mode Segment Switch: Düzenle VS Önizleme */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[styles.modeToggleBtn, mode === 'edit' && styles.activeModeBtn]}
          onPress={() => setMode('edit')}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={mode === 'edit' ? '#6366f1' : '#64748b'}
          />
          <Text style={[styles.modeToggleText, mode === 'edit' && styles.activeModeText]}>
            Düzenle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeToggleBtn, mode === 'preview' && styles.activeModeBtn]}
          onPress={() => setMode('preview')}
        >
          <Ionicons
            name="eye-outline"
            size={18}
            color={mode === 'preview' ? '#6366f1' : '#64748b'}
          />
          <Text style={[styles.modeToggleText, mode === 'preview' && styles.activeModeText]}>
            Kullanıcı Önizlemesi
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'edit' ? (
        /* EDIT MODE CONTENT */
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Avatar & User Banner */}
          <View style={styles.avatarCard}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: mainPhoto }} style={styles.avatarImage} />
              <View style={styles.uniBadge}>
                <Ionicons name="school" size={14} color="#ffffff" />
              </View>
            </View>
            <Text style={styles.userName}>
              {profile.firstName || 'Öğrenci'}, {profile.age || 20}
            </Text>
            <Text style={styles.userUni}>{profile.universityName || 'Akdeniz Üniversitesi'}</Text>
          </View>

          {/* Profile Completion Card */}
          <View style={styles.completionCard}>
            <View style={styles.completionRow}>
              <View style={styles.completionTextCol}>
                <Text style={styles.completionTitle}>{t('profile.completion')}</Text>
                <Text style={styles.completionSubtitle}>Profilini tamamlayarak %50 daha fazla eşleş al!</Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>%{completionRate}</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
            </View>
          </View>

          {/* Photo Manager Gallery Slots */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Fotoğraf Yöneticisi</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosRow}>
              {userPhotos.map((uri, index) => (
                <View key={index} style={styles.photoSlot}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                  {index === 0 && (
                    <View style={styles.mainBadgeSmall}>
                      <Text style={styles.mainBadgeTextSmall}>Ana</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.deletePhotoBtn} onPress={() => handleDeletePhoto(index)}>
                    <Ionicons name="close" size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
              {userPhotos.length < 5 && (
                <TouchableOpacity style={styles.addPhotoSlot} onPress={handlePickPhoto}>
                  <Ionicons name="add" size={28} color="#6366f1" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Bio Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t('profile.about_me')}</Text>
              <TouchableOpacity onPress={() => (isEditingBio ? handleSaveBio() : setIsEditingBio(true))}>
                <Text style={styles.editBtnText}>{isEditingBio ? t('common.save') : t('profile.edit')}</Text>
              </TouchableOpacity>
            </View>

            {isEditingBio ? (
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={setBio}
                maxLength={100}
                multiline
              />
            ) : (
              <Text style={styles.bioText}>{profile.bio || bio}</Text>
            )}
          </View>

          {/* Onboarding Preferences Data */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Profil Detayları (Onboarding)</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cinsiyet:</Text>
              <Text style={styles.detailValue}>{profile.gender || 'Kadın'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Aradığı Cinsiyet:</Text>
              <Text style={styles.detailValue}>
                {profile.targetGenders && profile.targetGenders.length > 0
                  ? profile.targetGenders.join(', ')
                  : 'Erkek'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>E-posta:</Text>
              <Text style={styles.detailValue}>{profile.email || 'tanımlanmadı'}</Text>
            </View>
          </View>

          {/* Buluşma Amaçları (Intents) */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t('profile.looking_for')}</Text>
            <View style={styles.chipsRow}>
              {(profile.intents && profile.intents.length > 0
                ? profile.intents
                : ['Activity Partner', 'Dating', 'Coffee']
              ).map((intent) => (
                <View key={intent} style={styles.intentChip}>
                  <Ionicons name="sparkles" size={14} color="#6366f1" />
                  <Text style={styles.intentChipText}>{intent}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* İlgi Alanları (Interests) */}
          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>İlgi Alanları</Text>
              <View style={styles.chipsRow}>
                {profile.interests.map((tag) => (
                  <View key={tag} style={styles.interestTag}>
                    <Text style={styles.interestTagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Karşı Tarafta Aradığı Özellikler (Traits) */}
          {profile.traits && profile.traits.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Aradığı Özellikler</Text>
              <View style={styles.chipsRow}>
                {profile.traits.map((trait) => (
                  <View key={trait} style={styles.traitTag}>
                    <Text style={styles.traitTagText}>✨ {trait}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        /* PREVIEW MODE CONTENT (How other students see your card in Keşfet) */
        <ScrollView contentContainerStyle={styles.previewScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.previewNoticeCard}>
            <Ionicons name="eye" size={20} color="#6366f1" />
            <Text style={styles.previewNoticeText}>
              Bu kart, diğer öğrencilerin seni Keşfet ekranında gördüğü halidir.
            </Text>
          </View>

          <View style={styles.previewCardContainer}>
            {/* 1. Main Photo Container with Story Tapping */}
            <Pressable onPress={handlePreviewPhotoPress} style={styles.previewPhotoContainer}>
              <Image
                source={{ uri: userPhotos[activePhotoIndex] || userPhotos[0] }}
                style={styles.previewMainPhoto}
              />

              {/* Story Segment Bars */}
              {userPhotos.length > 1 && (
                <View style={styles.storySegmentContainer}>
                  {userPhotos.map((_, index) => (
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

              {/* Distance Badge */}
              <View style={styles.distancePill}>
                <Ionicons name="location" size={12} color="#ffffff" />
                <Text style={styles.distancePillText}>Senin Profilin</Text>
              </View>

              {/* Photo Gradient Overlay & Info */}
              <View style={styles.photoGradient}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardName}>
                    {profile.firstName || 'Selin'}, {profile.age || 20}
                  </Text>
                </View>
                <View style={styles.uniTag}>
                  <Ionicons name="school" size={14} color="#ffffff" />
                  <Text style={styles.uniTagText}>{profile.universityName || 'Akdeniz Üniversitesi'}</Text>
                </View>
              </View>
            </Pressable>

            {/* 2. Buluşma Amacı Tags */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>Buluşma Amacı</Text>
              <View style={styles.chipsRow}>
                {(profile.intents && profile.intents.length > 0
                  ? profile.intents
                  : ['Activity Partner', 'Dating', 'Coffee']
                ).map((item) => (
                  <View key={item} style={styles.intentChip}>
                    <Ionicons name="sparkles" size={14} color="#6366f1" />
                    <Text style={styles.intentChipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 3. Bio */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>{t('profile.about_me')}</Text>
              <Text style={styles.bioText}>
                {profile.bio || 'Kampüste yeni insanlarla tanışmak istiyorum!'}
              </Text>
            </View>

            {/* 4. Secondary Photos Horizontal Scroll */}
            {userPhotos.length > 1 && (
              <View style={styles.cardSection}>
                <Text style={styles.sectionHeading}>Fotoğraf Galerisi</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosRow}>
                  {userPhotos.map((uri, idx) => (
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
              <View style={styles.chipsRow}>
                {(profile.interests && profile.interests.length > 0
                  ? profile.interests
                  : ['Kahve', 'Müzik', 'Sinema']
                ).map((tag) => (
                  <View key={tag} style={styles.interestTag}>
                    <Text style={styles.interestTagText}>#{tag}</Text>
                  </View>
                ))}
                {(profile.traits && profile.traits.length > 0
                  ? profile.traits
                  : ['Eğlenceli', 'Sakin']
                ).map((trait) => (
                  <View key={trait} style={styles.traitTag}>
                    <Text style={styles.traitTagText}>✨ {trait}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 16,
    padding: 4,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  activeModeBtn: {
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeModeText: {
    fontWeight: '800',
    color: '#6366f1',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  avatarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  uniBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  userUni: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  completionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  completionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  progressCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#eeeffe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6366f1',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  photosRow: {
    gap: 12,
  },
  photoSlot: {
    width: 80,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  mainBadgeSmall: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#6366f1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mainBadgeTextSmall: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoSlot: {
    width: 80,
    height: 100,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#c7d2fe',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
  },
  bioText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  bioInput: {
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeffe',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },
  intentChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },
  interestTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  interestTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  traitTag: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  traitTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#be185d',
  },
  /* PREVIEW STYLES */
  previewScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  previewNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeffe',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  previewNoticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#4338ca',
  },
  previewCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    paddingBottom: 24,
  },
  previewPhotoContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  previewMainPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storySegmentContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
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
    top: 24,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 28,
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
    fontSize: 14,
    fontWeight: '600',
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
});
