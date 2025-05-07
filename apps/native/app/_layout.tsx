import '../global.css';
import 'react-native-get-random-values';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'goals-tracker/native';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
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

function AppLayout() {
  const theme = useTheme();
  const sync = useAppState(state => state.sync);

  useEffect(() => {
    sync();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <GestureHandlerRootView className="flex-1">
        <Stack
          screenOptions={{
            headerTitle: '',
            contentStyle: { backgroundColor: theme.backgroundColor },
            fullScreenGestureEnabled: true,
            header: args => <Header {...args} />,
          }}
        />
        <CreateGoal />
        <ChangeGoal />
        <ConfirmDay />
        <ConfirmComplete />
        <ViewDay />
        <Confetti />
        <Toast />
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
}

export default AppLayout;
