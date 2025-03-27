import { isBefore } from 'date-fns';
import { v4 } from 'uuid';

import { date } from './date';
import { error } from './error';

type ValueOf<T> = T[keyof T];

export const GoalDayStatus = {
  Success: 'success',
  Error: 'error',
  Pending: 'pending',
  PendingToday: 'pending_today',
} as const;

export type GoalDayStatus = ValueOf<typeof GoalDayStatus>;

export interface GoalDay {
  count: number;
  date: string;
  status: GoalDayStatus;
  isBought: boolean;
  note?: string;
}

export interface Goal {
  id: string;
  description: string;
  useCoins: boolean;
  coins?: number;
  days: GoalDay[];
}

export interface CreateGoalDTO {
  /** Format: yyyy-mm-dd */
  date: string;
  description: string;
  useCoins: boolean;
  coins?: number;
  days: number;
}

/**
 * Determines the appropriate GoalDayStatus based on the date
 * @param {Date} dateValue - The date to determine the status
 */
export function getGoalDayStatus(dateValue: Date): GoalDayStatus {
  const normalizedDate = date.startOfDay(dateValue);
  const today = date.startOfDay(new Date());
  if (isBefore(normalizedDate, today)) {
    return GoalDayStatus.Error;
  } else if (date.isToday(normalizedDate)) {
    return GoalDayStatus.PendingToday;
  } else {
    return GoalDayStatus.Pending;
  }
}

/**
 * Create a goal with the given parameters
 * @param {CreateGoalDTO} params  The parameters to create a goal
 * @returns {Goal} The created goal
 */
export function createGoal(params: CreateGoalDTO): Goal {
  const dateGoal = date.startOfDay(date.parseISO(params.date));
  const goal: Goal = {
    id: v4(),
    description: params.description,
    useCoins: params.useCoins,
    coins: params.coins,
    days: Array.from({ length: params.days }, (_, index) => {
      const currentDate = date.addDays(dateGoal, index);
      return {
        count: index + 1,
        date: date.formatISO(currentDate),
        status: getGoalDayStatus(currentDate),
        isBought: false,
      };
    }),
  };
  return goal;
}

/**
 * Private helper function to complete a goal day by date and expected status
 * @param {Goal} goal - The goal to update
 * @param {string} goalDate - The date to find in yyyy-MM-dd format
 * @param {boolean} isBought - Whether the completion is bought
 * @param {string} note - Optional note for the goal day
 * @returns {void}
 */
export function completeGoalDay(goal: Goal, goalDate: string, isBought: boolean, note?: string): void {
  const day = goal.days.find(day => day.date === goalDate);
  if (!day) throw new error.BusinessError('Day is not found');
  if (day.status === GoalDayStatus.Success) {
    throw new error.BusinessError('Day is already completed');
  }
  const dayDate = date.toDate(day.date);
  if (!date.isToday(dayDate) && !date.isYesterday(dayDate)) {
    throw new error.BusinessError(`Cannot complete day ${day.count}`, 'You can only complete today or yesterday.');
  }
  if (date.isYesterday(dayDate)) {
    const todayIndex = goal.days.findIndex(d => date.isToday(date.toDate(d.date)));
    if (todayIndex !== -1 && goal.days[todayIndex].status === GoalDayStatus.Success) {
      throw new error.BusinessError('Cannot complete yesterday', 'If today is already completed.');
    }
  }

  for (let i = 0; i < goal.days.length; i++) {
    const day = goal.days[i];
    if (day.date === goalDate) {
      goal.days[i] = {
        ...day,
        status: GoalDayStatus.Success,
        isBought: isBought,
        note: note,
      };
      break;
    }
  }
}

/**
 * Complete today's goal by changing the PendingToday status to Success
 * @param {Goal} goal - The goal to update
 * @param {boolean} isBought - Whether the completion is bought (optional)
 * @returns {void}
 */
export function completeTodayGoal(goal: Goal, isBought: boolean = false): void {
  const today = date.formatISO(date.startOfDay(new Date()));
  completeGoalDay(goal, today, isBought);
}

/**
 * Complete yesterday's goal by changing the Error status to Success
 * @param {Goal} goal - The goal to update
 * @param {boolean} isBought - Whether the completion is bought (optional)
 * @returns {void}
 */
export function completeYesterdayGoal(goal: Goal, isBought: boolean = false): void {
  const yesterday = date.formatISO(date.subDays(date.startOfDay(new Date()), 1));
  completeGoalDay(goal, yesterday, isBought);
}

/**
 * Synchronize goal days to update their status based on the current date
 * @param {Goal[]} goals - The goal to synchronize
 * @returns {void}
 */
export function syncGoals(goals: Goal[]): void {
  for (const goal of goals) {
    syncDays(goal);
  }
}

/**
 * Synchronize goal days to update their status based on the current date
 * @param {Goal} goal - The goal to synchronize
 * @returns {void}
 */
export function syncDays(goal: Goal): void {
  const today = date.startOfDay(new Date());
  for (let i = 0; i < goal.days.length; i++) {
    const day = goal.days[i];
    const dayDate = date.startOfDay(date.parseISO(day.date));
    if (day.status === GoalDayStatus.Success) continue;
    if (date.isBefore(dayDate, today)) {
      if (day.status !== GoalDayStatus.Error) {
        goal.days[i] = {
          ...day,
          status: GoalDayStatus.Error,
        };
      }
    } else if (date.isToday(dayDate)) {
      goal.days[i] = {
        ...day,
        status: GoalDayStatus.PendingToday,
      };
    }
  }
}
