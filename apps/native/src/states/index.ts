import { create, StateCreator } from 'zustand';
import { computed } from 'zustand-computed-state';

import { AlertSlice, alertSlice } from './alertSlice';
import { ConfettiSlice, confettiSlice } from './confettiSlice';
import { ConfirmDaySlice, confirmDaySlice } from './confirmDaySlice';
import { GoalsSlice, goalsSlice } from './goalsSlice';

export type AppSlices = GoalsSlice & AlertSlice & ConfirmDaySlice & ConfettiSlice;

export type AppState<T> = StateCreator<AppSlices, [], [], T>;

export const useAppState = create<AppSlices>(
  computed((...args) => ({
    ...goalsSlice(...args),
    ...alertSlice(...args),
    ...confirmDaySlice(...args),
    ...confettiSlice(...args),
  })),
);
