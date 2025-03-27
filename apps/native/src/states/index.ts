import { create, StateCreator } from 'zustand';
import { computed } from 'zustand-computed-state';

import { AlertSlice, alertSlice } from './alertSlice';
import { ConfirmDaySlice, confirmDaySlice } from './confirmDaySlice';
import { GoalsSlice, goalsSlice } from './goalsSlice';

export type AppSlices = GoalsSlice & AlertSlice & ConfirmDaySlice;

export type AppState<T> = StateCreator<AppSlices, [], [], T>;

export const useAppState = create<AppSlices>(
  computed((...args) => ({
    ...goalsSlice(...args),
    ...alertSlice(...args),
    ...confirmDaySlice(...args),
  })),
);
