import { GoalDay } from 'goals-tracker/logic';

import { AppState } from '.';

export type ConfirmDayDataDTO = {
  goalDay: GoalDay;
};

export type ConfirmDaySlice = {
  isConfirmDayOpen: boolean;
  confirmDayResolver?: (value: { confirmed: boolean; note?: string }) => void;
  confirmDayData?: ConfirmDayDataDTO;
  openConfirmDay: (data: { goalDay: GoalDay }) => Promise<{ confirmed: boolean; note?: string }>;
  onConfirmDayConfirm: (note: string) => void;
  onConfirmDayCancel: () => void;
};

export const confirmDaySlice: AppState<ConfirmDaySlice> = (set, get) => ({
  isConfirmDayOpen: false,
  confirmDayResolver: undefined,
  confirmDayData: undefined,
  openConfirmDay(data) {
    return new Promise<{ confirmed: boolean; note?: string }>(resolve => {
      set({
        isConfirmDayOpen: true,
        confirmDayResolver: resolve,
        confirmDayData: data,
      });
    });
  },
  onConfirmDayConfirm(note: string) {
    const { confirmDayResolver } = get();
    set({ isConfirmDayOpen: false, confirmDayResolver: undefined, confirmDayData: undefined });
    confirmDayResolver?.({ confirmed: true, note });
  },
  onConfirmDayCancel() {
    const { confirmDayResolver } = get();
    set({ isConfirmDayOpen: false, confirmDayResolver: undefined, confirmDayData: undefined });
    confirmDayResolver?.({ confirmed: false, note: undefined });
  },
});
