import '../global.css';
import 'react-native-get-random-values';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from 'goals-tracker/tokens';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { ChangeGoal } from '~/app/components/change-goal';
import { ConfirmComplete } from '~/app/components/confirm-complete';
import { CreateGoal } from '~/app/components/create-goal';
import { Header } from '~/app/components/header';
import { useAppState } from '~/app/states';

function AppLayout() {
  const isCreateGoalOpen = useAppState(state => state.isCreateGoalOpen);
  const isChangeGoalOpen = useAppState(state => state.isChangeGoalOpen);
  const prepare = useAppState(state => state.prepare);

  useEffect(() => {
    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors['white'],
          },
          headerTitle: '',
          fullScreenGestureEnabled: true,
          header: args => <Header {...args} />,
        }}
      />
      {isCreateGoalOpen && <CreateGoal />}
      {isChangeGoalOpen && <ChangeGoal />}
      <ConfirmComplete />
      <Toast />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

export default AppLayout;
