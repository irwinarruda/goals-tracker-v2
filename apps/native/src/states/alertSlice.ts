import { AppState } from '.';

export type AlertSlice = {
  isAlertOpen: boolean;
  alertTitle: string;
  alertMessage: string;
  alertResolver?: (value: boolean) => void;
  fireAlert: (params: { title?: string; message?: string }) => Promise<boolean>;
  onAlertConfirm: () => void;
  onAlertCancel: () => void;
};

export const alertSlice: AppState<AlertSlice> = (set, get) => ({
  isAlertOpen: false,
  alertTitle: '',
  alertMessage: '',
  alertResolver: undefined,
  fireAlert({ title = 'Confirm Action', message = 'Are you sure you want to proceed?' }) {
    return new Promise<boolean>(resolve => {
      set({
        isAlertOpen: true,
        alertTitle: title,
        alertMessage: message,
        alertResolver: resolve,
      });
    });
  },
  onAlertConfirm() {
    const { alertResolver } = get();
    set({ isAlertOpen: false, alertResolver: undefined });
    alertResolver?.(true);
  },
  onAlertCancel() {
    const { alertResolver } = get();
    set({ isAlertOpen: false, alertResolver: undefined });
    alertResolver?.(false);
  },
});
