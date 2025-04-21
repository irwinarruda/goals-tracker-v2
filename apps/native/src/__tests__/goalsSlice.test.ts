import { date, GoalDay, GoalDayStatus } from 'goals-tracker/logic';

import { error } from '~/app/utils/error';
import { getApp } from '~/mocks/getApp';

function getCreateGoal() {
  return {
    description: 'Test Goal',
    date: date.formatISO(date.today()),
    coins: 10,
    useCoins: true,
    days: 30,
  };
}

describe('goalsSlice.createGoal', () => {
  let app: ReturnType<typeof getApp>;
  beforeEach(async () => (app = getApp()));
  test('should create a goal', async () => {
    app.state.onCreateGoalOpen();
    expect(app.state.isCreateGoalOpen).toBe(true);
    expect(app.state.goals.length).toBe(0);
    expect(app.state.selectedGoalId).toBeUndefined();
    expect(app.state.selectedGoal).toBe(undefined);
    expect(app.state.hasGoals).toBe(false);
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    const goal = app.state.goals[0];
    expect(app.state.isCreateGoalOpen).toBe(false);
    expect(app.state.goals.length).toBe(1);
    expect(app.state.selectedGoalId).toBe(goal.id);
    expect(app.state.selectedGoal?.id).toBe(goal.id);
    expect(app.state.hasGoals).toBe(true);
    expect(goal.days.length).toBe(30);
    await app.state.sync();
    expect(app.state.goals.length).toBe(1);
  });
  test('should create a different goal but not change the selected goal', async () => {
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    createGoalDTO.description = 'Test Other Goal';
    await app.state.createGoal(createGoalDTO);
    expect(app.state.goals.length).toBe(2);
    const goal = app.state.goals[1];
    expect(app.state.selectedGoalId).toBe(goal.id);
  });
  test('should be able to open and close create goal widget', async () => {
    expect(app.state.isCreateGoalOpen).toBe(false);
    app.state.onCreateGoalOpen();
    expect(app.state.isCreateGoalOpen).toBe(true);
    app.state.onCreateGoalClose();
    expect(app.state.isCreateGoalOpen).toBe(false);
  });
});

describe('goalsSlice.changeGoal', () => {
  let app: ReturnType<typeof getApp>;
  const createGoalDTO = getCreateGoal();
  beforeEach(async () => {
    app = getApp();
    await app.state.createGoal(createGoalDTO);
  });
  test('should change goal', async () => {
    createGoalDTO.description = 'Test Other Goal';
    await app.state.createGoal(createGoalDTO);
    const id = app.state.goals[0].id;
    app.state.onChangeGoalOpen();
    expect(app.state.isChangeGoalOpen).toBe(true);
    await app.state.changeGoal(id);
    expect(app.state.isChangeGoalOpen).toBe(false);
    expect(app.state.selectedGoalId).toBe(id);
  });
  test('should not change goal same selected id', async () => {
    const goalId = app.state.selectedGoalId;
    await expect(() => app.state.changeGoal(goalId!)).rejects.toThrow(error.UserError);
  });
  test('should not change goal with wrong id', async () => {
    const wrongId = 'wrong-id';
    await expect(() => app.state.changeGoal(wrongId)).rejects.toThrow(error.DeveloperError);
  });
  test('should be able to open and close change goal widget', async () => {
    expect(app.state.isChangeGoalOpen).toBe(false);
    app.state.onChangeGoalOpen();
    expect(app.state.isChangeGoalOpen).toBe(true);
    app.state.onChangeGoalClose();
    expect(app.state.isChangeGoalOpen).toBe(false);
  });
});

describe('goalsSlice.removeGoal', () => {
  let app: ReturnType<typeof getApp>;
  const createGoalDTO = getCreateGoal();
  beforeEach(async () => {
    app = getApp();
    await app.state.createGoal(createGoalDTO);
  });
  test('should remove goal', async () => {
    const goalId = app.state.goals[0].id;
    app.confirmAlertAfter();
    await app.state.removeGoal(goalId);
    expect(app.state.goals.length).toBe(0);
    expect(app.state.selectedGoalId).toBeUndefined();
  });
  test('should remove goal and not change the selected id if it is not the one removed', async () => {
    createGoalDTO.description = 'Test Other Goal';
    await app.state.createGoal(createGoalDTO);
    const goalId = app.state.goals[0].id;
    app.confirmAlertAfter();
    await app.state.removeGoal(goalId);
    expect(app.state.goals.length).toBe(1);
    expect(app.state.selectedGoalId).toBe(app.state.goals[0].id);
  });
  test('should throw error if id does not exist', async () => {
    const wrongId = 'wrong-id';
    app.confirmAlertAfter();
    await expect(() => app.state.removeGoal(wrongId)).rejects.toThrow(error.DeveloperError);
  });
  test('should not remove goal if cancel the alert', async () => {
    const goalId = app.state.goals[0].id;
    app.cancelAlertAfter();
    await app.state.removeGoal(goalId);
    expect(app.state.goals.length).toBe(1);
  });
});

describe('goalsSlice.changeGoalDay', () => {
  test('should not complete goal day without any goals', async () => {
    const app = getApp();
    expect(app.state.selectedGoalId).toBeUndefined();
    await expect(() => app.state.completeGoalDay({} as any)).rejects.toThrow(error.DeveloperError);
  });
  test('should not complete goal day if the day does not exist', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    await expect(() => app.state.completeGoalDay(GoalDay.create(20, '2023-01-01'))).rejects.toThrow(error.UserError);
  });
  test('should not change change goal day if confirm day modal is canceled', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    expect(app.state.selectedGoal).toBeDefined();
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.PendingToday);
    expect(day.count).toBe(1);
    app.cancelConfirmDay();
    await app.state.completeGoalDay(day);
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.PendingToday);
  });
  test('should change today goal day', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    expect(app.state.selectedGoal).toBeDefined();
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.PendingToday);
    expect(day.count).toBe(1);
    app.confirmConfirmDay('Confirm');
    await app.state.completeGoalDay(day);
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.Success);
  });
  test('should view and close success goal day details', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    app.confirmConfirmDay('Confirm');
    const day = app.state.selectedGoal!.days[0];
    await app.state.completeGoalDay(day);
    expect(app.state.isViewDayOpen).toBe(false);
    expect(app.state.viewGoalDay).toBeUndefined();
    expect(app.state.viewGoalDayDate).toBeUndefined();
    await app.state.completeGoalDay(day);
    expect(app.state.isViewDayOpen).toBe(true);
    expect(app.state.viewGoalDayDate).toBe(day.date);
    expect(app.state.viewGoalDay?.note).toBe('Confirm');
    app.state.onViewDayClose();
    expect(app.state.isViewDayOpen).toBe(false);
    expect(app.state.viewGoalDay).toBeUndefined();
    expect(app.state.viewGoalDayDate).toBeUndefined();
  });
  test('should view and close error goal day details', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 2);
    createGoalDTO.date = date.formatISO(backDate);
    await app.state.createGoal(createGoalDTO);
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.Error);
    await app.state.completeGoalDay(day);
    expect(app.state.isViewDayOpen).toBe(true);
    expect(app.state.viewGoalDayDate).toBe(day.date);
    expect(app.state.viewGoalDay?.date).toBe(createGoalDTO.date);
  });
  test('should not change goal status if is yesterday error and canceled the alert', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(backDate);
    await app.state.createGoal(createGoalDTO);
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.Error);
    app.cancelAlertAfter();
    await app.state.completeGoalDay(day);
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.Error);
  });
  test('should not change goal status if is yesterday error and confirmConfirmDay is canceled', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(backDate);
    await app.state.createGoal(createGoalDTO);
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.Error);
    app.confirmAlertAfter();
    app.cancelConfirmDay();
    await app.state.completeGoalDay(day);
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.Error);
  });
  test('should change goal status if is yesterday error', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(backDate);
    await app.state.createGoal(createGoalDTO);
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.Error);
    app.confirmAlertAfter();
    app.confirmConfirmDay('Confirm');
    await app.state.completeGoalDay(day);
    const updatedDay = app.state.selectedGoal!.days[0];
    expect(updatedDay.status).toBe(GoalDayStatus.Success);
    expect(updatedDay.note).toBe('Confirm');
  });
  test('should not complete pending goal day', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    const day = app.state.selectedGoal!.days[1];
    await expect(() => app.state.completeGoalDay(day)).rejects.toThrow(error.UserError);
  });
});

describe('goalsSlice.completeTodayGoalWithCoins', () => {
  test('should not complete today without any goals', async () => {
    const app = getApp();
    expect(app.state.selectedGoalId).toBeUndefined();
    await expect(() => app.state.completeTodayGoalWithCoins()).rejects.toThrow(error.UserError);
  });
  test('should not complete today if today is not found', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const forwardDate = date.addDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(forwardDate);
    await app.state.createGoal(createGoalDTO);
    await expect(() => app.state.completeTodayGoalWithCoins()).rejects.toThrow(error.UserError);
  });
  test('should not complete today if it is already completed', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    app.confirmConfirmDay('Confirm');
    await app.state.completeGoalDay(app.state.selectedGoal!.days[0]);
    const day = app.state.selectedGoal!.days[0];
    expect(day.status).toBe(GoalDayStatus.Success);
    await expect(() => app.state.completeTodayGoalWithCoins()).rejects.toThrow(error.UserError);
  });
  test('should not complete today if not enouth coins left', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    await expect(() => app.state.completeTodayGoalWithCoins()).rejects.toThrow(error.UserError);
  });
  test('should not complete today if no alert confirmed', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(backDate);
    createGoalDTO.coins = 1;
    await app.state.createGoal(createGoalDTO);
    app.confirmAlertAfter();
    app.confirmConfirmDay('Confirm');
    await app.state.completeGoalDay(app.state.selectedGoal!.days[0]);
    app.cancelAlertAfter();
    await app.state.completeTodayGoalWithCoins();
    const day = app.state.selectedGoal!.days[1];
    expect(day.status).toBe(GoalDayStatus.PendingToday);
  });
  test('should not complete today if no confirmModal confirmed', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(backDate);
    createGoalDTO.coins = 1;
    await app.state.createGoal(createGoalDTO);
    app.confirmAlertAfter();
    app.confirmConfirmDay('Confirm');
    await app.state.completeGoalDay(app.state.selectedGoal!.days[0]);
    app.confirmAlertAfter();
    app.cancelConfirmDay();
    await app.state.completeTodayGoalWithCoins();
    const day = app.state.selectedGoal!.days[1];
    expect(day.status).toBe(GoalDayStatus.PendingToday);
  });
  test('should complete today', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    const backDate = date.subDays(date.today(), 1);
    createGoalDTO.date = date.formatISO(backDate);
    createGoalDTO.coins = 1;
    await app.state.createGoal(createGoalDTO);
    app.confirmAlertAfter();
    app.confirmConfirmDay('Confirm');
    await app.state.completeGoalDay(app.state.selectedGoal!.days[0]);
    app.confirmAlertAfter();
    app.confirmConfirmDay('Confirm');
    await app.state.completeTodayGoalWithCoins();
    const day = app.state.selectedGoal!.days[1];
    expect(day.status).toBe(GoalDayStatus.Success);
    expect(day.note).toBe('Confirm');
  });
});

describe('goalsSlice.updateGoalDayNote', () => {
  test('should not update note without any goals', async () => {
    const app = getApp();
    expect(app.state.selectedGoalId).toBeUndefined();
    await expect(() => app.state.updateGoalDayNote({} as any, 'Test')).rejects.toThrow(error.DeveloperError);
  });
  test('should update note', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    app.confirmAlertAfter();
    app.confirmConfirmDay('');
    await app.state.completeGoalDay(app.state.selectedGoal!.days[0]);
    const day = app.state.selectedGoal!.days[0];
    expect(app.state.selectedGoal!.days[0].note).toBe('');
    expect(app.state.isAddNoteOpen).toBe(false);
    app.state.onAddNoteOpen();
    expect(app.state.isAddNoteOpen).toBe(true);
    await app.state.updateGoalDayNote(day, 'Test');
    expect(app.state.isAddNoteOpen).toBe(false);
    expect(app.state.selectedGoal!.days[0].note).toBe('Test');
  });
});

describe('goalsSlice.others', () => {
  test('should sync goals', async () => {
    const app = getApp();
    expect(async () => await app.state.sync()).not.toThrow();
    expect(app.state.goals.length).toBe(0);
  });
  test('should sync goal days from a goal', async () => {
    const app = getApp();
    const createGoalDTO = getCreateGoal();
    await app.state.createGoal(createGoalDTO);
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.PendingToday);
    jest.useFakeTimers();
    jest.setSystemTime(date.addDays(date.today(), 1));
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.PendingToday);
    await app.state.sync();
    expect(app.state.selectedGoal!.days[0].status).toBe(GoalDayStatus.Error);
    jest.useRealTimers();
  });
  test('should not be able to open change goal without goal selected', async () => {
    const app = getApp();
    expect(() => app.state.onChangeGoalOpen()).toThrow(error.UserError);
    expect(app.state.isChangeGoalOpen).toBe(false);
  });
  test('should not be able to open view goal without goal selected', async () => {
    const app = getApp();
    expect(() => app.state.onViewDayOpen({} as any)).toThrow(error.DeveloperError);
    expect(app.state.isViewDayOpen).toBe(false);
  });
});
