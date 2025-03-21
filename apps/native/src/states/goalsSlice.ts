import { isToday, isYesterday, parseISO } from 'date-fns';
import { completeGoalDay, createGoal, CreateGoalDTO, Goal, GoalDay, syncGoals } from 'goals-tracker/logic';
import { compute } from 'zustand-computed-state';

import { error } from '../utils/error';
import { storage } from '../utils/storage';
import { AppState } from '.';

export type GoalsSlice = {
  prepare: () => Promise<void>;
  persist: () => Promise<void>;
  goals: Goal[];
  hasGoals: boolean;
  selectedGoalId?: string;
  selectedGoal?: Goal;
  completeGoalDay(goalDay: GoalDay): Promise<void>;
  createGoal(params: CreateGoalDTO): Promise<void>;
  changeGoal(id: string): Promise<void>;
  coins: number;
  isCreateGoalOpen: boolean;
  onCreateGoalOpen(): void;
  onCreateGoalClose(): void;
  isChangeGoalOpen: boolean;
  onChangeGoalOpen(): void;
  onChangeGoalClose(): void;
};

export const goalsSlice: AppState<GoalsSlice> = (set, get) => ({
  async prepare() {
    const { persist } = get();
    const data = await storage.get<GoalsSlice>('goalsSlice');
    if (!data) return;
    syncGoals(data.goals);
    set({ goals: data.goals, coins: data.coins, selectedGoalId: data.selectedGoalId });
    await persist();
  },
  async persist() {
    const { goals, coins, selectedGoalId } = get();
    await storage.set('goalsSlice', { goals, coins, selectedGoalId });
  },

  goals: [],
  selectedGoalId: undefined,
  ...compute(get, state => ({
    hasGoals: state.goals.length > 0,
    selectedGoal: state.goals.find(goal => goal.id === state.selectedGoalId),
  })),
  async completeGoalDay(goalDay: GoalDay) {
    const { selectedGoalId, goals, persist } = get();
    const cloneGoals = JSON.parse(JSON.stringify(goals)) as Goal[];
    if (!selectedGoalId) throw new error.DeveloperError('No goal selected');
    const goalIndex = cloneGoals.findIndex(goal => goal.id === selectedGoalId);
    const day = cloneGoals[goalIndex].days.find(day => day.date === goalDay.date);
    if (!day) throw new error.DeveloperError('Day not found');
    if (!isToday(parseISO(day.date)) && !isYesterday(parseISO(day.date)))
      throw new error.UserError(`Cannot complete day ${day.count}`, 'You can only complete today or yesterday.');
    completeGoalDay(cloneGoals[goalIndex], day.date, false);
    set({ goals: cloneGoals });
    await persist();
  },
  async createGoal(params) {
    const { selectedGoalId, persist } = get();
    const goal = createGoal(params);
    set(state => ({
      goals: [...state.goals, goal],
      selectedGoalId: selectedGoalId || goal.id,
      isCreateGoalOpen: false,
    }));
    await persist();
  },
  async changeGoal(id) {
    const { goals, selectedGoalId, persist } = get();
    if (selectedGoalId === id) throw new error.UserError('Goal already selected');
    if (!goals.some(goal => goal.id === id)) throw new error.DeveloperError('Goal not found');
    set({ selectedGoalId: id, isChangeGoalOpen: false });
    await persist();
  },

  coins: 0,

  isCreateGoalOpen: false,
  onCreateGoalOpen() {
    set({ isCreateGoalOpen: true });
  },
  onCreateGoalClose() {
    set({ isCreateGoalOpen: false });
  },

  isChangeGoalOpen: false,
  onChangeGoalOpen() {
    const { hasGoals } = get();
    if (!hasGoals) throw new error.UserError('No goals to select', 'Create a goal first to be able to select it.');
    set({ isChangeGoalOpen: true });
  },
  onChangeGoalClose() {
    set({ isChangeGoalOpen: false });
  },
});
