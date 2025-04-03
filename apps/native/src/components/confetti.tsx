import { useRef } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

import { useAppState } from '~/app/states';

export function Confetti() {
  const confettiRef = useRef<ConfettiCannon>(null);
  const isConfettiVisible = useAppState(state => state.isConfettiVisible);
  const hideConfetti = useAppState(state => state.hideConfetti);

  if (!isConfettiVisible) return null;
  return (
    <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} ref={confettiRef} fadeOut onAnimationEnd={hideConfetti} />
  );
}
