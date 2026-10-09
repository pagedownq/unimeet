import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_CONVERSATIONS, MOCK_LIKES, Conversation } from '@/data/mockData';

export default function ChatListScreen() {
  const { t } = useTranslation();

  const handleOpenChat = (id: string, name: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id, name },
    });
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => handleOpenChat(item.id, item.matchName)}
    >
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.matchAvatar }} style={styles.avatar} />
        {item.unreadCount > 0 && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.conversationInfo}>
        <View style={styles.topRow}>
          <Text style={styles.matchName}>{item.matchName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('tabs.chat')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mutual Matches Row */}
        <View style={styles.matchesSection}>
          <Text style={styles.sectionTitle}>{t('chat.matches')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesRow}>
            {MOCK_LIKES.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchAvatarItem}
                onPress={() => handleOpenChat(`c_${match.id}`, match.name)}
              >
                <View style={styles.matchAvatarWrapper}>
                  <Image source={{ uri: match.photos[0] }} style={styles.matchAvatar} />
                  <View style={styles.matchBadge}>
                    <Ionicons name="heart" size={10} color="#ffffff" />
                  </View>
                </View>
                <Text style={styles.matchAvatarName} numberOfLines={1}>
                  {match.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsSection}>
          <Text style={styles.sectionTitle}>{t('chat.conversations')}</Text>
          <FlatList
            data={MOCK_CONVERSATIONS}
            keyExtractor={(item) => item.id}
            renderItem={renderConversationItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  matchesSection: {
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  matchesRow: {
    paddingHorizontal: 20,
    gap: 16,
  },
  matchAvatarItem: {
    alignItems: 'center',
    width: 68,
  },
  matchAvatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  matchAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  matchBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ec4899',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  matchAvatarName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  conversationsSection: {
    paddingTop: 16,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
