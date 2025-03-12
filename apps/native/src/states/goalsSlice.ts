import { date } from '../utils/date';
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
  onGoalOpen(): void;
  onGoalClose(): void;
  createGoal(params: CreateGoalDTO): void;
};

export const goalsSlice: AppState<GoalsSlice> = set => ({
  goals: [],
  isCreateGoalOpen: false,
  createGoal(params) {
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
  onGoalOpen() {
    set({ isCreateGoalOpen: true });
  },
  onGoalClose() {
    set({ isCreateGoalOpen: false });
  },
});
