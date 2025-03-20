import { addDays, format, isBefore, isToday, parseISO, startOfDay, subDays } from 'date-fns';
import { v4 } from 'uuid';

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
 * @param {Date} date - The date to determine the status
 */
export function getGoalDayStatus(date: Date): GoalDayStatus {
  const normalizedDate = startOfDay(date);
  const today = startOfDay(new Date());
  if (isBefore(normalizedDate, today)) {
    return GoalDayStatus.Error;
  } else if (isToday(normalizedDate)) {
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
  const dateGoal = startOfDay(parseISO(params.date));
  const goal: Goal = {
    id: v4(),
    description: params.description,
    useCoins: params.useCoins,
    coins: params.coins,
    days: Array.from({ length: params.days }, (_, index) => {
      const currentDate = addDays(dateGoal, index);
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      return {
        count: index + 1,
        date: formattedDate,
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
 * @param {string} date - The date to find in yyyy-MM-dd format
 * @param {boolean} isBought - Whether the completion is bought
 * @returns {void}
 */
export function completeGoalDay(goal: Goal, date: string, isBought: boolean): void {
  for (let i = 0; i < goal.days.length; i++) {
    const day = goal.days[i];
    if (day.date === date) {
      goal.days[i] = {
        ...day,
        status: GoalDayStatus.Success,
        isBought: isBought,
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
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
  completeGoalDay(goal, today, isBought);
}

/**
 * Complete yesterday's goal by changing the Error status to Success
 * @param {Goal} goal - The goal to update
 * @param {boolean} isBought - Whether the completion is bought (optional)
 * @returns {void}
 */
export function completeYesterdayGoal(goal: Goal, isBought: boolean = false): void {
  const yesterday = format(subDays(startOfDay(new Date()), 1), 'yyyy-MM-dd');
  completeGoalDay(goal, yesterday, isBought);
}

/**
 * Synchronize goal days to update their status based on the current date
 * @param {Goal[]} goal - The goal to synchronize
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
  const today = startOfDay(new Date());
  for (let i = 0; i < goal.days.length; i++) {
    const day = goal.days[i];
    const dayDate = startOfDay(parseISO(day.date));
    if (day.status === GoalDayStatus.Success) continue;
    if (isBefore(dayDate, today)) {
      if (day.status !== GoalDayStatus.Error) {
        goal.days[i] = {
          ...day,
          status: GoalDayStatus.Error,
        };
      }
    } else if (isToday(dayDate)) {
      goal.days[i] = {
        ...day,
        status: GoalDayStatus.PendingToday,
      };
    }
  }
}
