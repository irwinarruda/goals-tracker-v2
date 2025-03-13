import { date } from '~/app/utils/date';

import { AppState } from '.';

export type GoalDayStatus = 'success' | 'error' | 'pending' | 'pending_today';

export interface GoalDay {
  date: string;
  status: GoalDayStatus;
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
  isCreateGoalOpen: boolean;
  onCreateGoalOpen(): void;
  onCreateGoalClose(): void;
  createGoal(params: CreateGoalDTO): Promise<void>;
  isChangeGoalOpen: boolean;
  onChangeGoalOpen(): void;
  onChangeGoalClose(): void;
};

export const goalsSlice: AppState<GoalsSlice> = set => ({
  goals: [],
  isCreateGoalOpen: false,
  isChangeGoalOpen: false,
  async createGoal(params) {
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
        };
      }),
    };
    set(state => ({
      goals: [...state.goals, goal],
    }));
  },
  onCreateGoalOpen() {
    set({ isCreateGoalOpen: true });
  },
  onCreateGoalClose() {
    set({ isCreateGoalOpen: false });
  },
  onChangeGoalOpen() {
    set({ isChangeGoalOpen: true });
  },
  onChangeGoalClose() {
    set({ isChangeGoalOpen: false });
  },
});
