import { AppState } from '.';

export type ConfettiSlice = {
  isConfettiVisible: boolean;
  fireConfetti: () => void;
  hideConfetti: () => void;
};

export const confettiSlice: AppState<ConfettiSlice> = set => ({
  isConfettiVisible: false,
  fireConfetti() {
    set({ isConfettiVisible: true });
  },
  hideConfetti() {
    set({ isConfettiVisible: false });
  },
});
