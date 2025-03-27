import {
  completeGoalDay,
  createGoal,
  CreateGoalDTO,
  date,
  Goal,
  GoalDay,
  GoalDayStatus,
  syncGoals,
} from 'goals-tracker/logic';
import { compute } from 'zustand-computed-state';

import { clone } from '~/app/utils/clone';
import { error } from '~/app/utils/error';
import { storage } from '~/app/utils/storage';

import { AppState } from '.';

export type GoalsSlice = {
  sync: () => Promise<void>;
  persist: () => Promise<void>;
  goals: Goal[];
  hasGoals: boolean;
  selectedGoalId?: string;
  selectedGoal?: Goal;
  completeGoalDay(goalDay: GoalDay): Promise<void>;
  createGoal(params: CreateGoalDTO): Promise<void>;
  changeGoal(id: string): Promise<void>;
  coins: number;
  canUseCoins: boolean;
  isCreateGoalOpen: boolean;
  onCreateGoalOpen(): void;
  onCreateGoalClose(): void;
  isChangeGoalOpen: boolean;
  onChangeGoalOpen(): void;
  onChangeGoalClose(): void;
  completeTodayGoalWithCoins(): Promise<void>;
};

export const goalsSlice: AppState<GoalsSlice> = (set, get) => ({
  async sync() {
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

  coins: 0,
  goals: [],
  selectedGoalId: undefined,
  ...compute(get, state => {
    const selectedGoal = state.goals.find(goal => goal.id === state.selectedGoalId);
    let canUseCoins = false;
    if (selectedGoal) {
      const todayDay = selectedGoal.days.find(day => date.isToday(date.toDate(day.date)));
      if (todayDay && todayDay.status === GoalDayStatus.PendingToday)
        canUseCoins = selectedGoal.useCoins && state.coins >= selectedGoal.coins!;
      else canUseCoins = false;
    }
    return {
      hasGoals: state.goals.length > 0,
      selectedGoal: selectedGoal,
      canUseCoins: canUseCoins,
    };
  }),
  async createGoal(params) {
    const { persist } = get();
    const goal = createGoal(params);
    set(state => ({
      goals: [...state.goals, goal],
      selectedGoalId: goal.id,
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

  async completeGoalDay(goalDay: GoalDay) {
    const { selectedGoal, goals, coins, persist, fireAlert, openConfirmDay } = get();
    if (!selectedGoal) throw new error.DeveloperError('No goal selected');
    const todayDay = selectedGoal.days.find(day => day.date === goalDay.date);
    if (!todayDay) throw new error.UserError('Today not found');
    if (todayDay.status === GoalDayStatus.Success) throw new error.UserError('Goal is already completed');

    if (date.isYesterday(date.toDate(goalDay.date))) {
      const completed = await fireAlert({
        title: 'Warning!',
        message: "Are you sure you want to change yesterday's goal?",
      });
      if (!completed) return;
    }
    const { confirmed, note } = await openConfirmDay({ goalDay });
    if (!confirmed) return;

    const newGoals = clone(goals);
    const goalIndex = newGoals.findIndex(goal => goal.id === selectedGoal.id);
    completeGoalDay(newGoals[goalIndex], goalDay.date, false, note);
    set({ goals: newGoals, coins: coins + 1 });
    await persist();
  },
  async completeTodayGoalWithCoins() {
    const { selectedGoal, canUseCoins, coins, goals, persist, fireAlert, openConfirmDay } = get();
    if (!selectedGoal) throw new error.DeveloperError('No goal selected');
    const today = date.formatISO(date.startOfDay(new Date()));
    const todayDay = selectedGoal.days.find(day => day.date === today);
    if (!todayDay) throw new error.UserError('Today not found');
    if (todayDay.status === GoalDayStatus.Success) throw new error.UserError("Today's goal is already completed");
    if (!canUseCoins)
      throw new error.UserError('Not enough coins', `You need ${selectedGoal.coins} coins to complete this goal.`);
    const coinsAfter = coins - selectedGoal.coins!;
    const completed = await fireAlert({
      title: 'Use Coins',
      message: `This will cost ${selectedGoal.coins} coins. You will have ${coinsAfter} coins left. Do you want to proceed?`,
    });
    if (!completed) return;
    const { confirmed, note } = await openConfirmDay({ goalDay: todayDay });
    if (!confirmed) return;

    const newGoals = clone(goals);
    const goalIndex = newGoals.findIndex(goal => goal.id === selectedGoal.id);
    completeGoalDay(newGoals[goalIndex], today, true, note);
    set({ goals: newGoals, coins: coinsAfter });
    await persist();
  },

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
