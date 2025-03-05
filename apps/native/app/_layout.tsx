import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from 'goals-react/tokens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Header } from '~/app/components/header';

function AppLayout() {
  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.white,
          },
          headerTitle: '',
          header: args => <Header {...args} />,
        }}
      />
      <StatusBar backgroundColor="red" style="light" />
    </GestureHandlerRootView>
  );
}

export default AppLayout;
