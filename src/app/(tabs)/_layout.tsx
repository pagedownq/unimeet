import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBox, focused && styles.activeIconBox]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={focused ? '#6366f1' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.explore'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBox, focused && styles.activeIconBox]}>
              <Ionicons
                name={focused ? 'flame' : 'flame-outline'}
                size={24}
                color={focused ? '#6366f1' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: t('tabs.likes'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBox, focused && styles.activeIconBox]}>
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={22}
                color={focused ? '#6366f1' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('tabs.chat'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBox, focused && styles.activeIconBox]}>
              <Ionicons
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                size={22}
                color={focused ? '#6366f1' : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 82 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconBox: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  activeIconBox: {
    backgroundColor: '#eeeffe',
  },
});
