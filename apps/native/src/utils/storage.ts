import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async set(key: string, value: any) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  },
  async remove(key: string) {
    await AsyncStorage.removeItem(key);
  },
};
