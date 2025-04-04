import { useRef } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

import { useAppState } from '~/app/states';

type ConfettiProps = {
  origin?: { x: number; y: number };
};

export function Confetti({ origin = { x: -10, y: 0 } }: ConfettiProps) {
  const confettiRef = useRef<ConfettiCannon>(null);
  const isConfettiVisible = useAppState(state => state.isConfettiVisible);
  const hideConfetti = useAppState(state => state.hideConfetti);

  if (!isConfettiVisible) return null;
  return (
    <ConfettiCannon
      count={200}
      explosionSpeed={250}
      fallSpeed={1000}
      origin={origin}
      ref={confettiRef}
      fadeOut
      onAnimationEnd={hideConfetti}
    />
  );
}
