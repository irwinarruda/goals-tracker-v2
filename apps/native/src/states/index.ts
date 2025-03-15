import { create, StateCreator } from 'zustand';
import { computed } from 'zustand-computed-state';

import { GoalsSlice, goalsSlice } from './goalsSlice';

export type AppSlices = GoalsSlice;

export type AppState<T> = StateCreator<AppSlices, [], [], T>;

export const useAppState = create<AppSlices>(
  computed((...args) => ({
    ...goalsSlice(...args),
  })),
);
