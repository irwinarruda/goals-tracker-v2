const cache = new Map<string, string>();

export const storage = {
  async set(key: string, value: any) {
    cache.set(key, JSON.stringify(value));
  },
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = cache.get(key);
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  },
  async remove(key: string) {
    cache.delete(key);
  },
  reset() {
    cache.clear();
  },
};
