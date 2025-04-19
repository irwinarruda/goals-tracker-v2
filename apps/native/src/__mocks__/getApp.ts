import { useAppState } from '~/app/states';
import { storage } from '~/app/utils/storage';

export function getApp() {
  (storage as any).reset();
  return {
    get state() {
      return useAppState.getState();
    },
    cancelConfirmDay() {
      setTimeout(() => {
        if (!this.state.isConfirmDayOpen) return;
        this.state.onConfirmDayCancel();
      }, 5);
    },
    confirmConfirmDay(note: string) {
      setTimeout(() => {
        if (!this.state.isConfirmDayOpen) return;
        this.state.onConfirmDayConfirm(note);
      }, 5);
    },
    cancelAlertAfter() {
      setTimeout(() => {
        if (!this.state.isAlertOpen) return;
        this.state.onAlertCancel();
      }, 5);
    },
    confirmAlertAfter() {
      setTimeout(() => {
        if (!this.state.isAlertOpen) return;
        this.state.onAlertConfirm();
      }, 5);
    },
  };
}
