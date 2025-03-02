'use client';

import { Button } from 'design-system';

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Button onClick={() => console.log('Pressed!')} text="Boop" />
    </div>
  );
}
