'use client';

import { Button } from 'goals-tokens';

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Button text="Boop" onClick={() => console.log('Pressed!')} />
    </div>
  );
}
