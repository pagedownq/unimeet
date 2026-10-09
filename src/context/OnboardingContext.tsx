import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  email: string;
  universityName: string;
  photos: string[];
  firstName: string;
  birthDate: string;
  age: number;
  intents: string[];
  gender: string;
  targetGenders: string[];
  bio: string;
  interests: string[];
  traits: string[];
  preferredUniversities: string[];
  completedOnboarding: boolean;
}

const INITIAL_PROFILE: UserProfile = {
  email: '',
  universityName: '',
  photos: [],
  firstName: '',
  birthDate: '',
  age: 20,
  intents: [],
  gender: 'Kadın',
  targetGenders: ['Erkek'],
  bio: '',
  interests: [],
  traits: [],
  preferredUniversities: [],
  completedOnboarding: false,
};

interface OnboardingContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  resetProfile: () => void;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = '@unimeet_user_profile';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(PROFILE_STORAGE_KEY)
      .then((stored) => {
        if (stored && isMounted) {
          setProfile(JSON.parse(stored));
        }
      })
      .catch((e) => console.error('Failed to load profile:', e))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated)).catch((e) =>
        console.error('Failed to save profile state:', e)
      );
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    setProfile((prev) => {
      const updated = { ...prev, completedOnboarding: true };
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated)).catch((e) =>
        console.error('Failed to save profile state:', e)
      );
      return updated;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(INITIAL_PROFILE);
    AsyncStorage.removeItem(PROFILE_STORAGE_KEY).catch((e) => console.error('Failed to reset profile:', e));
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        completeOnboarding,
        isLoading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
