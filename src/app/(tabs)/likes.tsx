import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_LIKES, StudentCard } from '@/data/mockData';

export default function LikesScreen() {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState<StudentCard | null>(null);

  const renderItem = ({ item }: { item: StudentCard }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedStudent(item)}>
      <Image source={{ uri: item.photos[0] }} style={styles.avatar} />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardName}>
          {item.name}, {item.age}
        </Text>
        <View style={styles.uniBadge}>
          <Ionicons name="school" size={12} color="#ffffff" />
          <Text style={styles.uniBadgeText} numberOfLines={1}>
            {item.universityCode}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('likes.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('likes.subtitle')}</Text>
      </View>

      {MOCK_LIKES.length > 0 ? (
        <FlatList
          data={MOCK_LIKES}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.rowWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>{t('likes.empty')}</Text>
        </View>
      )}

      {/* Student Profile Modal */}
      <Modal visible={!!selectedStudent} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedStudent && (
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setSelectedStudent(null)} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color="#1f2937" />
                  </TouchableOpacity>
                </View>

                <Image source={{ uri: selectedStudent.photos[0] }} style={styles.modalImage} />

                <Text style={styles.modalName}>
                  {selectedStudent.name}, {selectedStudent.age}
                </Text>
                <Text style={styles.modalUni}>{selectedStudent.university}</Text>

                <Text style={styles.modalSectionTitle}>{t('profile.about_me')}</Text>
                <Text style={styles.modalBio}>{selectedStudent.bio}</Text>

                <TouchableOpacity
                  style={styles.matchBtn}
                  onPress={() => {
                    setSelectedStudent(null);
                  }}
                >
                  <Ionicons name="heart" size={20} color="#ffffff" />
                  <Text style={styles.matchBtnText}>Geri Beğen & Eşleş!</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  uniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  uniBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
  },
  modalScroll: {
    padding: 24,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  modalImage: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    marginBottom: 16,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  modalUni: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalBio: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 24,
  },
  matchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  matchBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
