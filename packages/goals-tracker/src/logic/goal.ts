import { v4 } from 'uuid';

import { date } from './date';
import { error } from './error';

export class GoalDayT {
  constructor(
    readonly id: string,
    readonly count: number,
    readonly date: string,
    public status: GoalDayStatus,
    public isBought: boolean,
    public note?: string,
  ) {}

  /**
   * Creates a new goal day and return it's class instance
   * @param count - The count of the goal day
   * @param dateValue - The date of the goal day in yyyy-MM-dd format
   * @returns The created goal day
   **/
  static create(count: number, dateValue: string) {
    const normalizedDate = date.parseStartOfDayISO(dateValue);
    let status: GoalDayStatus;
    if (date.isBefore(normalizedDate, date.today())) {
      status = GoalDayStatus.Error;
    } else if (date.isToday(normalizedDate)) {
      status = GoalDayStatus.PendingToday;
    } else {
      status = GoalDayStatus.Pending;
    }
    return new GoalDayT(v4(), count, dateValue, status, false, undefined);
  }

  get isYesterday() {
    return date.isYesterday(date.parseStartOfDayISO(this.date));
  }

  get isToday() {
    return date.isToday(date.parseStartOfDayISO(this.date));
  }

  /**
   * Synchronizes the goal day status based on the current date
   **/
  sync() {
    const dayDate = date.parseStartOfDayISO(this.date);
    if (this.status === GoalDayStatus.Success) return;
    if (date.isBefore(dayDate, date.today())) {
      if (this.status !== GoalDayStatus.Error) {
        this.status = GoalDayStatus.Error;
      }
    } else if (date.isToday(dayDate)) {
      this.status = GoalDayStatus.PendingToday;
    }
  }

  /**
   * Updates the note of the goal day
   * @param note - The new note
   **/
  updateNote(note: string) {
    if (note === this.note) {
      throw new error.BusinessError('Note is the same as before');
    }
    this.note = note;
  }

  /**
   * Updates the note of the goal day
   * @param todayDay - The goal day of today
   * @param isBought - Whether the current goal day is bought
   * @param note - The new note for the goal day
   **/
  complete(todayDay: GoalDayT, isBought: boolean, note?: string) {
    if (!this.isToday && !this.isYesterday) {
      throw new error.BusinessError(`Cannot complete day ${this.count}`, 'You can only complete today or yesterday.');
    }
    if (this.status !== GoalDayStatus.PendingToday && this.status !== GoalDayStatus.Error) {
      throw new error.BusinessError(`Cannot complete day ${this.count}`);
    }
    if (isBought && this.isYesterday) {
      throw new error.BusinessError('Cannot complete yesterday goal with coins');
    }
    this.ensureCanCompleteYesterday(todayDay);
    this.status = GoalDayStatus.Success;
    this.isBought = isBought;
    this.note = note;
  }

  /**
   * Ensures that yesterday's goal day can be completed
   * @param todayDay - The goal day of today
   **/
  ensureCanCompleteYesterday(todayDay: GoalDayT) {
    if (this.isYesterday && todayDay.status !== GoalDayStatus.PendingToday) {
      throw new error.BusinessError("Today's day is already completed");
    }
  }

  /**
   * Ensures that the goal day can be completed
   **/
  ensureCanCompleteToday() {
    if (!this.isToday) throw new error.BusinessError('This is not today');
    if (this.status === GoalDayStatus.Success) throw new error.BusinessError('Day is already completed');
    if (this.status !== GoalDayStatus.PendingToday) throw new error.BusinessError('Something wrong happened');
  }

  /**
   * Ensures that the goal day is yesterday and has error
   **/
  isYesterdayError() {
    return this.status === GoalDayStatus.Error && this.isYesterday;
  }

  /**
   * Check if the current goal has already been completed either by being success or error
   **/
  shouldReadOnly() {
    return (this.status === GoalDayStatus.Error && !this.isYesterday) || this.status === GoalDayStatus.Success;
  }

  /**
   * Clones the goal day instance
   **/
  clone() {
    return new GoalDayT(this.id, this.count, this.date, this.status, this.isBought, this.note);
  }

  /**
   * Converts the goal day to JSON format
   **/
  toJSON() {
    return {
      id: this.id,
      count: this.count,
      date: this.date,
      status: this.status,
      isBought: this.isBought,
      note: this.note,
    };
  }

  /**
   * Creates a goal day from JSON data
   * @param json - The JSON data to create the goal day from
   **/
  static fromJSON(json: any) {
    return new GoalDayT(json.id, json.count, json.date, json.status, json.isBought, json.note);
  }
}

export class GoalT {
  constructor(
    readonly id: string,
    readonly description: string,
    readonly useCoins: boolean,
    readonly coins: number | undefined,
    readonly days: GoalDayT[],
  ) {}

  /**
   * Creates a new goal and return it's class instance
   * @param params - Parameters to create a goal
   * @returns The created goal instance
   */
  static create(params: CreateGoalDTO) {
    const startDate = date.parseStartOfDayISO(params.date);
    const days = Array.from({ length: params.days }, (_, index) => {
      const dayDate = date.addDays(startDate, index);
      return GoalDayT.create(index + 1, date.formatISO(dayDate));
    });
    return new GoalT(v4(), params.description, params.useCoins, params.coins, days);
  }

  /**
   * Updates a goal day note
   * @param goalDate - The date to find in yyyy-MM-dd format
   * @param note - The note to add
   */
  updateGoalDayNote(goalDate: string, note: string): void {
    const day = this.days.find(day => day.date === goalDate);
    if (!day) throw new error.BusinessError('Day is not found');
    if (day.status !== GoalDayStatus.Success && day.status !== GoalDayStatus.Error) {
      throw new error.BusinessError('Cannot add note to incomplete day');
    }
    day.updateNote(note);
  }

  /**
   * Private helper function to complete a goal day by date and expected status
   * @param goalDate - The date to find in yyyy-MM-dd format
   * @param isBought - Whether the completion is bought
   * @param note - Optional note for the goal day
   */
  completeGoalDay(goalDate: string, isBought: boolean, note?: string) {
    const day = this.days.find(d => d.date === goalDate);
    if (!day) throw new error.BusinessError('The day was not found');
    const today = this.days.find(d => d.isToday);
    if (!today) throw new error.BusinessError('The day was not found');
    day.complete(today, isBought, note);
  }

  /**
   * Synchronize goal days to update their status based on the current date
   */
  syncDays(): void {
    for (const day of this.days) {
      day.sync();
    }
  }

  /**
   * Clones the goal instance
   */
  clone() {
    return new GoalT(
      this.id,
      this.description,
      this.useCoins,
      this.coins,
      this.days.map(day => day.clone()),
    );
  }

  /**
   * Converts the goal to JSON format
   **/
  toJSON() {
    return {
      id: this.id,
      description: this.description,
      useCoins: this.useCoins,
      coins: this.coins,
      days: this.days.map(day => day.toJSON()),
    };
  }

  /**
   * Creates a goal from JSON data
   * @param json - The JSON data to create the goal from
   **/
  static fromJSON(json: any) {
    const days = json.days.map((day: any) => {
      return GoalDayT.fromJSON(day);
    });
    return new GoalT(json.id, json.description, json.useCoins, json.coins, days);
  }
}

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
  const dateGoal = date.startOfDay(date.toDate(params.date));
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
    const dayDate = date.startOfDay(date.toDate(day.date));
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
