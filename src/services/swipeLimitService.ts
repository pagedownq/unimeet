import AsyncStorage from '@react-native-async-storage/async-storage';

const SWIPE_LIMIT_KEY = '@unimeet_swipe_limit';
export const MAX_SWIPES = 20;
export const RESET_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours in ms

export interface SwipeLimitState {
  remainingSwipes: number;
  resetTimestamp: number; // Unix timestamp in ms
}

export async function getSwipeLimitState(): Promise<SwipeLimitState> {
  try {
    const json = await AsyncStorage.getItem(SWIPE_LIMIT_KEY);
    const now = Date.now();

    if (!json) {
      const initialState: SwipeLimitState = {
        remainingSwipes: MAX_SWIPES,
        resetTimestamp: now + RESET_INTERVAL_MS,
      };
      await AsyncStorage.setItem(SWIPE_LIMIT_KEY, JSON.stringify(initialState));
      return initialState;
    }

    const state: SwipeLimitState = JSON.parse(json);

    // If 12 hours passed since last reset timestamp
    if (now >= state.resetTimestamp) {
      const resetState: SwipeLimitState = {
        remainingSwipes: MAX_SWIPES,
        resetTimestamp: now + RESET_INTERVAL_MS,
      };
      await AsyncStorage.setItem(SWIPE_LIMIT_KEY, JSON.stringify(resetState));
      return resetState;
    }

    return state;
  } catch (error) {
    console.error('Error reading swipe limit state:', error);
    return {
      remainingSwipes: MAX_SWIPES,
      resetTimestamp: Date.now() + RESET_INTERVAL_MS,
    };
  }
}

export async function decrementSwipeCount(): Promise<SwipeLimitState> {
  const currentState = await getSwipeLimitState();
  if (currentState.remainingSwipes <= 0) {
    return currentState;
  }

  const updatedState: SwipeLimitState = {
    ...currentState,
    remainingSwipes: currentState.remainingSwipes - 1,
  };

  await AsyncStorage.setItem(SWIPE_LIMIT_KEY, JSON.stringify(updatedState));
  return updatedState;
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
