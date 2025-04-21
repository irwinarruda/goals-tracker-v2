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

export interface CreateGoalDTO {
  /** Format: yyyy-mm-dd */
  date: string;
  description: string;
  useCoins: boolean;
  coins?: number;
  days: number;
}

export class GoalDay {
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
    return new GoalDay(v4(), count, dateValue, status, false, undefined);
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
  complete(todayDay: GoalDay, isBought: boolean, note?: string) {
    if (!this.isToday() && !this.isYesterday()) {
      throw new error.BusinessError(`Cannot complete day ${this.count}`, 'You can only complete today or yesterday.');
    }
    if (this.status !== GoalDayStatus.PendingToday && this.status !== GoalDayStatus.Error) {
      throw new error.BusinessError(`Cannot complete day ${this.count}`);
    }
    if (this.isYesterday() && isBought) {
      throw new error.BusinessError('Cannot complete yesterday goal with coins');
    }
    if (this.isYesterday() && todayDay.status !== GoalDayStatus.PendingToday) {
      throw new error.BusinessError("Today's day is already completed");
    }
    this.status = GoalDayStatus.Success;
    this.isBought = isBought;
    this.note = note;
  }

  /**
   * Checks if the goal day is yesterday
   */
  isYesterday() {
    return date.isYesterday(date.parseStartOfDayISO(this.date));
  }

  /**
   * Checks if the goal day is today
   */
  isToday() {
    return date.isToday(date.parseStartOfDayISO(this.date));
  }

  /**
   * Checks if the goal day is pending
   */
  isPending() {
    return this.status === GoalDayStatus.Pending;
  }

  /**
   * Checks if the it this is yesterday and the status is error
   **/
  isYesterdayError() {
    return this.status === GoalDayStatus.Error && this.isYesterday();
  }

  /**
   * Check if the current goal has already been completed either by being success or error
   **/
  shouldReadOnly() {
    return (this.status === GoalDayStatus.Error && !this.isYesterday()) || this.status === GoalDayStatus.Success;
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
   * Clones the goal day instance
   **/
  clone() {
    return new GoalDay(this.id, this.count, this.date, this.status, this.isBought, this.note);
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
    return new GoalDay(json.id, json.count, json.date, json.status, json.isBought, json.note);
  }
}

export class Goal {
  constructor(
    readonly id: string,
    readonly description: string,
    readonly useCoins: boolean,
    readonly coins: number | undefined,
    readonly days: GoalDay[],
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
      return GoalDay.create(index + 1, date.formatISO(dayDate));
    });
    return new Goal(v4(), params.description, params.useCoins, params.coins, days);
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
    const today = this.days.find(d => d.isToday());
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
    return new Goal(
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
      return GoalDay.fromJSON(day);
    });
    return new Goal(json.id, json.description, json.useCoins, json.coins, days);
  }

  /**
   * Clones a list of goals
   * @param goals - List of goals for the operation
   **/
  static arrayClone(goals: Goal[]) {
    return goals.map(goal => goal.clone());
  }

  /**
   * Arranges a list of goals to JSON
   * @param goals - List of goals for the operation
   **/
  static arrayToJSON(goals: Goal[]) {
    return goals.map(goal => goal.toJSON());
  }

  /**
   * Returns a list of goals from JSON
   * @param goals - List of goals for the operation
   **/
  static arrayFromJSON(goals: any[]) {
    return goals.map((goal: any) => this.fromJSON(goal));
  }
}
