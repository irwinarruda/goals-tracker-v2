import { CreateGoalDTO, date, Goal, GoalDay, GoalDayStatus } from 'goals-tracker/logic';
import { compute } from 'zustand-computed-state';

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
  removeGoal(id: string): Promise<void>;
  coins: number;
  canUseCoins: boolean;
  isCreateGoalOpen: boolean;
  onCreateGoalOpen(): void;
  onCreateGoalClose(): void;
  isChangeGoalOpen: boolean;
  onChangeGoalOpen(): void;
  onChangeGoalClose(): void;
  completeTodayGoalWithCoins(): Promise<void>;
  isViewDayOpen: boolean;
  viewGoalDayDate?: string;
  viewGoalDay?: GoalDay;
  onViewDayOpen(goalDay: GoalDay): void;
  onViewDayClose(): void;
  updateGoalDayNote(goalDay: GoalDay, note: string): Promise<void>;
  isAddNoteOpen: boolean;
  onAddNoteOpen(): void;
  onAddNoteClose(): void;
};

export const goalsSlice: AppState<GoalsSlice> = (set, get) => ({
  async sync() {
    const { persist } = get();
    const data = await storage.get<GoalsSlice>('goalsSlice');
    if (!data) return;
    set({
      goals: Goal.arrayFromJSON(data.goals),
      coins: data.coins,
      selectedGoalId: data.selectedGoalId,
    });
    await persist();
  },
  async persist() {
    const { goals, coins, selectedGoalId } = get();
    await storage.set('goalsSlice', { goals: Goal.arrayToJSON(goals), coins, selectedGoalId });
  },

  coins: 0,
  goals: [],
  selectedGoalId: undefined,
  ...compute(get, state => {
    const selectedGoal = state.goals.find(goal => goal.id === state.selectedGoalId);
    let canUseCoins = false;
    let viewGoalDay = undefined;

    if (selectedGoal) {
      const todayDay = selectedGoal.days.find(day => day.isToday());
      if (todayDay && todayDay.status === GoalDayStatus.PendingToday)
        canUseCoins = selectedGoal.useCoins && state.coins >= selectedGoal.coins!;
      else canUseCoins = false;

      if (state.viewGoalDayDate) {
        viewGoalDay = selectedGoal.days.find(day => day.date === state.viewGoalDayDate);
      }
    }

    return {
      hasGoals: state.goals.length > 0,
      selectedGoal,
      canUseCoins,
      viewGoalDay,
    };
  }),
  async createGoal(params) {
    const { persist } = get();
    const goal = Goal.create(params);
    set(state => ({
      goals: [...state.goals, goal],
      selectedGoalId: goal.id,
      isCreateGoalOpen: false,
    }));
    await persist();
  },
  async changeGoal(id) {
    const { goals, selectedGoalId, persist, onChangeGoalClose } = get();
    if (selectedGoalId === id) throw new error.UserError('Goal already selected');
    if (!goals.some(goal => goal.id === id)) throw new error.DeveloperError('Goal not found');
    set({ selectedGoalId: id });
    onChangeGoalClose();
    await persist();
  },
  async removeGoal(id) {
    const { goals, selectedGoalId, persist, fireAlert, onChangeGoalClose } = get();
    const confirmed = await fireAlert({
      title: 'Delete Goal',
      message: 'Are you sure you want to delete this goal? This action cannot be undone.',
    });
    if (!confirmed) return;

    const newGoals = goals.filter(goal => goal.id !== id);
    if (goals.length === newGoals.length) throw new error.DeveloperError('Goal not found');
    const newSelectedGoalId = selectedGoalId === id ? undefined : selectedGoalId;
    set({ goals: newGoals, selectedGoalId: newSelectedGoalId });
    onChangeGoalClose();
    await persist();
  },
  async completeGoalDay(goalDay) {
    const { selectedGoal, goals, coins, persist, fireAlert, fireConfetti, openConfirmDay, onViewDayOpen } = get();
    if (!selectedGoal) throw new error.DeveloperError('No goal selected');
    const selectedDay = selectedGoal.days.find(day => day.id === goalDay.id);
    if (!selectedDay) throw new error.UserError('The day was not found');
    if (selectedDay.shouldReadOnly()) {
      onViewDayOpen(selectedDay);
      return;
    }
    if (selectedDay.isPending()) {
      throw new error.UserError(
        `Cannot complete day ${selectedDay.count}`,
        'You can only complete today or yesterday.',
      );
    }
    if (selectedDay.isYesterdayError()) {
      const completed = await fireAlert({
        title: 'Warning!',
        message: "Are you sure you want to change yesterday's goal?",
      });
      if (!completed) return;
    }
    const confirmDay = await openConfirmDay({ goalDay: selectedDay, isBought: false });
    const note = confirmDay.note;
    if (!confirmDay.confirmed) return;

    selectedGoal.completeGoalDay(selectedDay.date, false, note);
    fireConfetti();
    set({ goals: Goal.arrayClone(goals), coins: coins + 1 });
    await persist();
  },
  async completeTodayGoalWithCoins() {
    const { selectedGoal, canUseCoins, coins, goals, persist, fireAlert, fireConfetti, openConfirmDay } = get();
    if (!selectedGoal) throw new error.UserError('No goal selected');
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
    const { confirmed, note } = await openConfirmDay({ goalDay: todayDay, isBought: true });
    if (!confirmed) return;

    selectedGoal.completeGoalDay(today, true, note);
    fireConfetti();
    set({ goals: Goal.arrayClone(goals), coins: coinsAfter });
    await persist();
  },

  async updateGoalDayNote(goalDay, note) {
    const { selectedGoal, goals, persist } = get();
    if (!selectedGoal) throw new error.DeveloperError('No goal selected');

    selectedGoal.updateGoalDayNote(goalDay.date, note);
    set({ goals: Goal.arrayClone(goals), isAddNoteOpen: false });
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

  isViewDayOpen: false,
  viewGoalDayDate: undefined,
  onViewDayOpen(goalDay) {
    const { selectedGoal } = get();
    if (!selectedGoal) throw new error.DeveloperError('No goal selected');
    set({ isViewDayOpen: true, viewGoalDayDate: goalDay.date });
  },
  onViewDayClose() {
    const { onAddNoteClose } = get();
    set({ isViewDayOpen: false, viewGoalDayDate: undefined });
    onAddNoteClose();
  },

  isAddNoteOpen: false,
  onAddNoteOpen() {
    set({ isAddNoteOpen: true });
  },
  onAddNoteClose() {
    set({ isAddNoteOpen: false });
  },
});
