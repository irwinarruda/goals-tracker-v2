import React from 'react';
import Dialog from 'react-native-dialog';

import { useAppState } from '~/app/states';

export function ConfirmComplete() {
  const isAlertOpen = useAppState(state => state.isAlertOpen);
  const alertTitle = useAppState(state => state.alertTitle);
  const alertMessage = useAppState(state => state.alertMessage);
  const onAlertCancel = useAppState(state => state.onAlertCancel);
  const onAlertConfirm = useAppState(state => state.onAlertConfirm);

  return (
    <Dialog.Container visible={isAlertOpen}>
      <Dialog.Title>{alertTitle}</Dialog.Title>
      <Dialog.Description>{alertMessage}</Dialog.Description>
      <Dialog.Button label="Cancel" onPress={onAlertCancel} />
      <Dialog.Button label="Confirm" onPress={onAlertConfirm} />
    </Dialog.Container>
  );
}
