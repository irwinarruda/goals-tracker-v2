import { colors } from 'goals-tracker/tokens';
import { colorScheme, useColorScheme } from 'nativewind';

colorScheme.set('light');
export function useTheme() {
  const { colorScheme } = useColorScheme();
  return {
    backgroundColor: colorScheme === 'dark' ? colors['black'] : colors['white'],
  };
}
