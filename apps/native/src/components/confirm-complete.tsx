import React from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';

import { useAppState } from '~/app/states';

export function ConfirmComplete() {
  const { isAlertOpen, alertTitle, alertMessage, onAlertCancel, onAlertConfirm } = useAppState();
  return (
    <View>
      <Dialog.Container visible={isAlertOpen}>
        <Dialog.Title>{alertTitle}</Dialog.Title>
        <Dialog.Description>{alertMessage}</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={onAlertCancel} />
        <Dialog.Button label="Confirm" onPress={onAlertConfirm} />
      </Dialog.Container>
    </View>
  );
}
