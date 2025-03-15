import { compute } from 'zustand-computed-state';

import { date } from '~/app/utils/date';

import { AppState } from '.';

export type GoalDayStatus = 'success' | 'error' | 'pending' | 'pending_today';

export interface GoalDay {
  date: string;
  status: GoalDayStatus;
  isBought: boolean;
}

export interface Goal {
  id: string;
  description: string;
  useCoins: boolean;
  coins?: number;
  days: GoalDay[];
}

export type CreateGoalDTO = {
  description: string;
  days: number;
  date: string;
  useCoins: boolean;
  coins?: number;
};

export type GoalsSlice = {
  goals: Goal[];
  hasGoals: boolean;
  selectedGoalId?: string;
  selectedGoal?: Goal;
  createGoal(params: CreateGoalDTO): Promise<void>;
  coins: number;
  isCreateGoalOpen: boolean;
  onCreateGoalOpen(): void;
  onCreateGoalClose(): void;
  isChangeGoalOpen: boolean;
  onChangeGoalOpen(): void;
  onChangeGoalClose(): void;
};

export const goalsSlice: AppState<GoalsSlice> = (set, get) => ({
  goals: [],
  selectedGoalId: undefined,
  ...compute(get, state => ({
    hasGoals: state.goals.length > 0,
    selectedGoal: state.goals.find(goal => goal.id === state.selectedGoalId),
  })),
  async createGoal(params) {
    const { selectedGoalId } = get();
    const dateGoal = new Date(params.date);
    const goal: Goal = {
      id: Date.now().toString(),
      description: params.description,
      useCoins: params.useCoins,
      coins: params.coins,
      days: Array.from({ length: params.days }, (_, index) => {
        return {
          date: date.addDays(dateGoal, index).toISOString().split('T')[0],
          status: index === 0 ? 'pending_today' : 'pending',
          isBought: false,
        };
      }),
    };
    set(state => ({
      goals: [...state.goals, goal],
      selectedGoalId: selectedGoalId || goal.id,
      isCreateGoalOpen: false,
    }));
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
    set({ isChangeGoalOpen: true });
  },
  onChangeGoalClose() {
    set({ isChangeGoalOpen: false });
  },
});
