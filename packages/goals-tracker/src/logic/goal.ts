import { v4 } from 'uuid';

import { date } from './date';
import { error } from './error';

// class GoalDayT {
//   constructor(
//     public count: number,
//     public date: string,
//     public status: GoalDayStatus,
//     public isBought: boolean,
//     public note?: string,
//   ) {}

//   static create(count: number, dateValue: string) {
//     const normalizedDate = date.startOfDay(dateValue);
//     const today = date.startOfDay(new Date());
//     let status: GoalDayStatus;
//     if (date.isBefore(normalizedDate, today)) {
//       status = GoalDayStatus.Error;
//     } else if (date.isToday(normalizedDate)) {
//       status = GoalDayStatus.PendingToday;
//     } else {
//       status = GoalDayStatus.Pending;
//     }
//     return new GoalDayT(count, dateValue, status, false, undefined);
//   }

//   get isYesterday() {
//     return date.isYesterday(date.startOfDay(date.toDate(this.date)));
//   }

//   get isToday() {
//     return date.isToday(date.startOfDay(date.toDate(this.date)));
//   }

//   complete(todayDay: GoalDayT, isBought: boolean, note?: string) {
//     if (!this.isToday && !this.isYesterday) {
//       throw new error.BusinessError(`Cannot complete day ${this.count}`, 'You can only complete today or yesterday.');
//     }
//     if (this.status !== GoalDayStatus.PendingToday && this.status !== GoalDayStatus.Error) {
//       throw new error.BusinessError(`Cannot complete day ${this.count}`);
//     }
//     this.ensureCanCompleteYesterday(todayDay);
//     this.status = GoalDayStatus.Success;
//     this.isBought = isBought;
//     this.note = note;
//   }

//   ensureCanCompleteYesterday(todayDay: GoalDayT) {
//     if (this.isYesterdayError() && todayDay.status === GoalDayStatus.Success) {
//       throw new error.BusinessError("Today's day is already completed");
//     }
//   }

//   ensureCanCompleteToday() {
//     if (!this.isToday) throw new error.BusinessError('This is not today');
//     if (this.status === GoalDayStatus.Success) throw new BusinessError('Day is already completed');
//     if (this.status !== GoalDayStatus.PendingToday) throw new BusinessError('Something wrong happened');
//   }

//   isYesterdayError() {
//     return this.status === GoalDayStatus.Error && this.isYesterday;
//   }

//   shouldReadOnly() {
//     return (this.status === GoalDayStatus.Error && !this.isYesterday) || this.status === GoalDayStatus.Success;
//   }
// }

// export class GoalT {
//   constructor(
//     public id: string,
//     public description: string,
//     public useCoins: boolean,
//     public coins: number | undefined,
//     public days: GoalDayT[],
//   ) {}

//   static create(id: string, description: string, useCoins: boolean, coins: number | undefined, daysNum: number) {
//     const dateGoal = date.startOfDay(new Date());
//     const days = Array.from({ length: daysNum }, (_, index) => {
//       const currentDate = date.addDays(dateGoal, index);
//       return GoalDayT.create(index + 1, date.formatISO(currentDate));
//     });
//     return new GoalT(id, description, useCoins, coins, days);
//   }

//   completeGoalDay(_day: GoalDayT, isBought: boolean, note?: string) {
//     const day = this.days.find(d => d.date === _day.date);
//     if (!day) throw new error.BusinessError('The day was not found');
//     const today = this.days.find(d => d.isToday);
//     if (!today) throw new error.BusinessError('The day was not found');
//     day.complete(today, isBought, note);
//   }
// }

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
  if (date.isBefore(normalizedDate, today)) {
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

/**
 * Updates a goal day note
 * @param {Goal} goal - The goal to update
 * @param {string} goalDate - The date to find in yyyy-MM-dd format
 * @param {string} note - The note to add
 */
export function updateGoalDayNote(goal: Goal, goalDate: string, note: string): void {
  const day = goal.days.find(day => day.date === goalDate);
  if (!day) throw new error.BusinessError('Day is not found');
  if (day.status !== GoalDayStatus.Success && day.status !== GoalDayStatus.Error) {
    throw new error.BusinessError('Cannot add note to incomplete day');
  }
  if (note === day.note) {
    throw new error.BusinessError('Note is the same as before');
  }

  for (let i = 0; i < goal.days.length; i++) {
    const day = goal.days[i];
    if (day.date === goalDate) {
      goal.days[i] = {
        ...day,
        note,
      };
      break;
    }
  }
}
