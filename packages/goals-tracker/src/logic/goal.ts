type ValueOf<T> = T[keyof T];

export const GoalDayStatus = {
  Success: 'success',
  Error: 'error',
  Pending: 'pending',
  PendingToday: 'pending_today',
} as const;

export type GoalDayStatus = ValueOf<typeof GoalDayStatus>;

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
