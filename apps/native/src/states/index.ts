import { create, StateCreator } from 'zustand';
import { computed } from 'zustand-computed-state';

import { AlertSlice, alertSlice } from './alertSlice';
import { GoalsSlice, goalsSlice } from './goalsSlice';

export type AppSlices = GoalsSlice & AlertSlice;

export type AppState<T> = StateCreator<AppSlices, [], [], T>;

export const useAppState = create<AppSlices>(
  computed((...args) => ({
    ...goalsSlice(...args),
    ...alertSlice(...args),
  })),
);
