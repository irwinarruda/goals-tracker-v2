import '../global.css';
import 'react-native-get-random-values';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
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
  const sync = useAppState(state => state.sync);

  useEffect(() => {
    sync();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Confetti />
          <Toast />
          <StatusBar style="light" />
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default AppLayout;
