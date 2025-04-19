import { getApp } from '~/mocks/getApp';

describe('alertSlice', () => {
  test('should trigger confetti', async () => {
    const app = getApp();
    expect(app.state.isConfettiVisible).toBe(false);
    app.state.fireConfetti();
    expect(app.state.isConfettiVisible).toBe(true);
    app.state.hideConfetti();
    expect(app.state.isConfettiVisible).toBe(false);
  });
});
