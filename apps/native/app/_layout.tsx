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
import { ConfirmDay } from '~/app/components/confirm-day';
import { CreateGoal } from '~/app/components/create-goal';
import { Header } from '~/app/components/header';
import { ViewDay } from '~/app/components/view-day';
import { useAppState } from '~/app/states';

/**
 * Renders the main layout for the application.
 *
 * On mount, it synchronizes the application state using a side-effect, and displays the primary user interface. The layout includes a gesture-enabled
 * container that holds a navigation stack with a custom header, as well as goal management components (CreateGoal, ChangeGoal, ConfirmDay, ConfirmComplete, and ViewDay), a Toast for notifications, and a light-styled StatusBar.
 *
 * @returns The application's main layout view.
 */
function AppLayout() {
  const sync = useAppState(state => state.sync);

  useEffect(() => {
    sync();
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
      <CreateGoal />
      <ChangeGoal />
      <ConfirmDay />
      <ConfirmComplete />
      <ViewDay />
      <Toast />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

export default AppLayout;
