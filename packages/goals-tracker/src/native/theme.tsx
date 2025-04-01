import { useColorScheme } from 'react-native';

import { colors } from '../tokens';

export type Theme = {
  backgroundColor: string;
  textColor: string;
  subTextColor: string;
  borderColor: string;
};

export function getTheme(theme: 'light' | 'dark' | null = 'light'): Theme {
  return {
    backgroundColor: theme === 'dark' ? colors['blue-900'] : colors['white'],
    textColor: theme === 'dark' ? colors['white'] : colors['black'],
    subTextColor: theme === 'dark' ? colors['gray-300'] : colors['gray-700'],
    borderColor: theme === 'dark' ? colors['gray-700'] : colors['gray-300'],
  };
}

export function useTheme() {
  const colorScheme = useColorScheme();
  return getTheme(colorScheme);
}
