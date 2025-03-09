import { create, StateCreator } from 'zustand';

import { GoalsSlice, goalsSlice } from './goalsSlice';

export type AppSlices = GoalsSlice;

export type AppState<T> = StateCreator<AppSlices, [], [], T>;

export const useAppState = create<AppSlices>((...args) => ({
  ...goalsSlice(...args),
}));
