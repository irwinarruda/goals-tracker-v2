import { getApp } from '~/mocks/getApp';

describe('alertSlice', () => {
  const app = getApp();
  test('should trigger confirmation alert and confirm', async () => {
    setTimeout(() => {
      expect(app.state.isAlertOpen).toBe(true);
      app.state.onAlertConfirm();
    }, 10);
    await app.state.fireAlert({
      message: 'Test Alert',
      title: 'Test Title',
    });
    expect(app.state.isAlertOpen).toBe(false);
  });
  test('should trigger confirmation alert and cancel', async () => {
    setTimeout(() => {
      expect(app.state.isAlertOpen).toBe(true);
      app.state.onAlertCancel();
    }, 10);
    await app.state.fireAlert({
      message: 'Test Alert',
      title: 'Test Title',
    });
    expect(app.state.isAlertOpen).toBe(false);
  });
  test('should trigger confirmation alert even without arguments', async () => {
    setTimeout(() => {
      expect(app.state.isAlertOpen).toBe(true);
      app.state.onAlertConfirm();
    }, 10);
    await app.state.fireAlert({});
    expect(app.state.isAlertOpen).toBe(false);
  });
});
