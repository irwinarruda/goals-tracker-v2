import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from 'goals-react/tokens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ChangeGoal } from '~/app/components/change-goal';
import { CreateGoal } from '~/app/components/create-goal';
import { Header } from '~/app/components/header';
import { useAppState } from '~/app/states';

function AppLayout() {
  const isCreateGoalOpen = useAppState(state => state.isCreateGoalOpen);
  const isChangeGoalOpen = useAppState(state => state.isChangeGoalOpen);
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
      <StatusBar style="light" />
      {isCreateGoalOpen && <CreateGoal />}
      {isChangeGoalOpen && <ChangeGoal />}
    </GestureHandlerRootView>
  );
}

export default AppLayout;
