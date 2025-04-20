import { vi } from 'vitest';

import { date } from './date';
import { error } from './error';
import { Goal, GoalDayStatus } from './goal';

function createGoal() {
  return {
    description: 'Test Goal',
    date: date.formatISO(date.subDays(date.today(), 2)),
    coins: 10,
    useCoins: true,
    days: 5,
  };
}

describe('goal', () => {
  test('should create a goal', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    expect(goal.id).toBeDefined();
    expect(goal.days.length).toBe(createGoalDTO.days);
    expect(goal.coins).toBe(createGoalDTO.coins);
    expect(goal.useCoins).toBe(createGoalDTO.useCoins);
    expect(goal.description).toBe(createGoalDTO.description);
    expect(goal.days[0].date).toBe(createGoalDTO.date);
    expect(goal.days[0].count).toBe(1);
    const lastDay = date.addDays(date.subDays(date.today(), 2), createGoalDTO.days - 1);
    expect(goal.days.at(-1)!.date).toBe(date.formatISO(lastDay));
    expect(goal.days.at(-1)!.count).toBe(createGoalDTO.days);
  });
  test('should not update goal note if day not found', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    expect(() => goal.updateGoalDayNote('2023-01-01', 'Not updated')).toThrow(error.BusinessError);
  });
  test('should not update goal note if day is incomplete', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    expect(() => goal.updateGoalDayNote(goal.days[2].date, 'Not updated')).toThrow(error.BusinessError);
    expect(() => goal.updateGoalDayNote(goal.days[3].date, 'Not updated')).toThrow(error.BusinessError);
    expect(() => goal.updateGoalDayNote(goal.days[4].date, 'Not updated')).toThrow(error.BusinessError);
  });
  test('should update goal note', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const note = 'Updated note';
    const firstDay = goal.days[0];
    goal.updateGoalDayNote(firstDay.date, note);
    expect(firstDay.note).toBe(note);
  });
  test('should not update goal note if the same as before', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const note = 'Updated note';
    const firstDay = goal.days[0];
    goal.updateGoalDayNote(firstDay.date, note);
    expect(() => goal.updateGoalDayNote(firstDay.date, note)).toThrow(error.BusinessError);
  });
  test('should not complete any goal day if today does not even exist', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.date = date.formatISO(date.addDays(createGoalDTO.date, createGoalDTO.days + 1));
    const goal = Goal.create(createGoalDTO);
    const firstDay = goal.days[0];
    const lastDay = goal.days.at(-1)!;
    expect(() => goal.completeGoalDay(firstDay.date, false)).toThrow(error.BusinessError);
    expect(() => goal.completeGoalDay(lastDay.date, false)).toThrow(error.BusinessError);
  });
  test('should not complete a goal day that does not exist', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.date = date.formatISO(date.addDays(createGoalDTO.date, createGoalDTO.days + 1));
    const goal = Goal.create(createGoalDTO);
    expect(() => goal.completeGoalDay('2023-11-11', false)).toThrow(error.BusinessError);
  });
  test('should complete today goal day', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const todayDay = goal.days[2];
    goal.completeGoalDay(todayDay.date, false);
    expect(goal.days[2].status).toBe(GoalDayStatus.Success);
    expect(goal.days[2].isBought).toBe(false);
  });
  test('should complete today goal day by bought', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const todayDay = goal.days[2];
    goal.completeGoalDay(todayDay.date, true);
    expect(goal.days[2].status).toBe(GoalDayStatus.Success);
    expect(goal.days[2].isBought).toBe(true);
  });
  test('should not complete any goal day that is not yesterday or today', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const firstDay = goal.days[0];
    const lastDay = goal.days.at(-1)!;
    expect(() => goal.completeGoalDay(firstDay.date, false)).toThrow(error.BusinessError);
    expect(() => goal.completeGoalDay(lastDay.date, false)).toThrow(error.BusinessError);
  });
  test('should not complete today goal day if it is already completed', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const todayDay = goal.days[2];
    goal.completeGoalDay(todayDay.date, false);
    expect(() => goal.completeGoalDay(todayDay.date, false)).toThrow(error.BusinessError);
  });
  test('should not complete yesterday goal day if today already completed', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const todayDay = goal.days[2];
    const yesterdayDay = goal.days[1];
    goal.completeGoalDay(todayDay.date, false);
    expect(() => goal.completeGoalDay(yesterdayDay.date, false)).toThrow(error.BusinessError);
  });
  test('should not complete yesterday goal day with bought', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const yesterdayDay = goal.days[1];
    expect(() => goal.completeGoalDay(yesterdayDay.date, true)).toThrow(error.BusinessError);
  });
  test('should complete yesterday goal day', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    const yesterdayDay = goal.days[1];
    goal.completeGoalDay(yesterdayDay.date, false);
    expect(yesterdayDay.status).toBe(GoalDayStatus.Success);
  });
  test('should not complete today goal day even if it is out of sync', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    vi.useFakeTimers();
    const mockDate = date.addDays(date.today(), 1);
    vi.setSystemTime(mockDate);
    const todayDay = goal.days[3];
    expect(todayDay.status).toBe(GoalDayStatus.Pending);
    expect(() => goal.completeGoalDay(todayDay.date, false)).toThrow(error.BusinessError);
    vi.useRealTimers();
  });
  test('should not complete yesterday goal day even if it is out of sync', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    vi.useFakeTimers();
    const mockDate = date.addDays(date.today(), 1);
    vi.setSystemTime(mockDate);
    const yesterdayDay = goal.days[2];
    expect(yesterdayDay.status).toBe(GoalDayStatus.PendingToday);
    expect(() => goal.completeGoalDay(yesterdayDay.date, false)).toThrow(error.BusinessError);
    vi.useRealTimers();
  });
  test('shoud sync goal days', () => {
    const createGoalDTO = createGoal();
    const goal = Goal.create(createGoalDTO);
    expect(goal.days[0].status).toBe(GoalDayStatus.Error);
    expect(goal.days[1].status).toBe(GoalDayStatus.Error);
    expect(goal.days[2].status).toBe(GoalDayStatus.PendingToday);
    expect(goal.days[3].status).toBe(GoalDayStatus.Pending);
    expect(goal.days[4].status).toBe(GoalDayStatus.Pending);
    vi.useFakeTimers();
    vi.setSystemTime(date.addDays(date.today(), 1));
    goal.syncDays();
    expect(goal.days[0].status).toBe(GoalDayStatus.Error);
    expect(goal.days[1].status).toBe(GoalDayStatus.Error);
    expect(goal.days[2].status).toBe(GoalDayStatus.Error);
    expect(goal.days[3].status).toBe(GoalDayStatus.PendingToday);
    expect(goal.days[4].status).toBe(GoalDayStatus.Pending);
    goal.completeGoalDay(goal.days[3].date, false);
    vi.setSystemTime(date.addDays(date.today(), 1));
    goal.syncDays();
    expect(goal.days[0].status).toBe(GoalDayStatus.Error);
    expect(goal.days[1].status).toBe(GoalDayStatus.Error);
    expect(goal.days[2].status).toBe(GoalDayStatus.Error);
    expect(goal.days[3].status).toBe(GoalDayStatus.Success);
    expect(goal.days[4].status).toBe(GoalDayStatus.PendingToday);
    vi.useRealTimers();
  });
  test('should return correct clone', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.days = 1;
    const goal = Goal.create(createGoalDTO);
    const clone = goal.clone();
    expect(clone.id).toBe(goal.id);
  });
  test('should return correct json', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.days = 1;
    const goal = Goal.create(createGoalDTO);
    const json = goal.toJSON();
    expect(json).toStrictEqual({
      id: goal.id,
      description: goal.description,
      coins: goal.coins,
      useCoins: goal.useCoins,
      days: [
        {
          id: goal.days[0].id,
          date: createGoalDTO.date,
          count: 1,
          status: GoalDayStatus.Error,
          isBought: false,
          note: undefined,
        },
      ],
    });
  });

  test('should return correct arrayToJSON', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.days = 1;
    const goal = Goal.create(createGoalDTO);
    const jsonArray = Goal.arrayToJSON([goal]);
    expect(jsonArray).toStrictEqual([
      {
        id: goal.id,
        description: goal.description,
        coins: goal.coins,
        useCoins: goal.useCoins,
        days: [
          {
            id: goal.days[0].id,
            date: createGoalDTO.date,
            count: 1,
            status: GoalDayStatus.Error,
            isBought: false,
            note: undefined,
          },
        ],
      },
    ]);
  });

  test('should return correct arrayClone', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.days = 1;
    const goal = Goal.create(createGoalDTO);
    const clonedArray = Goal.arrayClone([goal]);
    expect(clonedArray).toHaveLength(1);
    expect(clonedArray[0].id).toBe(goal.id);
    expect(clonedArray[0]).not.toBe(goal); // Ensure it's a deep clone
  });

  test('should return correct arrayFromJSON', () => {
    const createGoalDTO = createGoal();
    createGoalDTO.days = 1;
    const goal = Goal.create(createGoalDTO);
    const fromJsonArray = Goal.arrayFromJSON([
      {
        id: goal.id,
        description: goal.description,
        coins: goal.coins,
        useCoins: goal.useCoins,
        days: [
          {
            id: goal.days[0].id,
            date: createGoalDTO.date,
            count: 1,
            status: GoalDayStatus.Error,
            isBought: false,
            note: undefined,
          },
        ],
      },
    ]);
    expect(fromJsonArray.length).toBe(1);
    expect(fromJsonArray[0].id).toBe(goal.id);
    expect(fromJsonArray[0].description).toBe(goal.description);
    expect(fromJsonArray[0].days[0].id).toBe(goal.days[0].id);
  });
});
