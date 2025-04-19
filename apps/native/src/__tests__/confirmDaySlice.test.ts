import { GoalDayStatus } from 'goals-tracker/logic';

import { getApp } from '~/mocks/getApp';

describe('confirmDaySlice', () => {
  const app = getApp();
  test('should trigger confirmation alert and confirm', async () => {
    setTimeout(() => {
      expect(app.state.isConfirmDayOpen).toBe(true);
      app.state.onConfirmDayConfirm('Confirmed');
    }, 10);
    await app.state.openConfirmDay({
      isBought: false,
      goalDay: {
        date: new Date().toISOString().split('T')[0],
        isBought: false,
        count: 0,
        status: GoalDayStatus.Pending,
        note: 'Confirmed',
      },
    });
    expect(app.state.isConfirmDayOpen).toBe(false);
  });
  test('should trigger confirmation alert and cancel', async () => {
    setTimeout(() => {
      expect(app.state.isConfirmDayOpen).toBe(true);
      app.state.onConfirmDayCancel();
    }, 10);
    await app.state.openConfirmDay({
      isBought: false,
      goalDay: {
        date: new Date().toISOString().split('T')[0],
        isBought: false,
        count: 0,
        status: GoalDayStatus.Pending,
        note: 'Confirmed',
      },
    });
    expect(app.state.isConfirmDayOpen).toBe(false);
  });
});
