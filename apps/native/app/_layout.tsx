import '../global.css';
import 'react-native-get-random-values';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { ChangeGoal } from '~/app/components/change-goal';
import { Confetti } from '~/app/components/confetti';
import { ConfirmComplete } from '~/app/components/confirm-complete';
import { ConfirmDay } from '~/app/components/confirm-day';
import { CreateGoal } from '~/app/components/create-goal';
import { Header } from '~/app/components/header';
import { ViewDay } from '~/app/components/view-day';
import { useAppState } from '~/app/states';

Appearance.setColorScheme('light');

function AppLayout() {
  const sync = useAppState(state => state.sync);

  useEffect(() => {
    sync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitle: '',
          fullScreenGestureEnabled: true,
          header: args => <Header {...args} />,
        }}
      />
      <CreateGoal />
      <ChangeGoal />
      <ConfirmDay />
      <ConfirmComplete />
      <ViewDay />
      <Toast />
      <Confetti />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

export default AppLayout;
