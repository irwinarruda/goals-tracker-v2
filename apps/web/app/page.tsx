'use client';

import { Button } from 'goals-react/web';

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Button onPress={() => console.log('Pressed!')}>Boop!</Button>
    </div>
  );
}
