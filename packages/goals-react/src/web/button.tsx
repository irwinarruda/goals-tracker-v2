import * as React from 'react';

export type ButtonProps = {
  onPress: () => void;
  children?: React.ReactNode;
};

export function Button({ children, onPress }: ButtonProps) {
  return (
    <button style={styles.button} onClick={onPress}>
      {children}
    </button>
  );
}

const styles = {
  button: {
    backgroundColor: '#2f80ed',
    borderRadius: 10,
    fontSize: 15,
    maxWidth: 200,
    paddingBottom: 14,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 14,
    textAlign: 'center' as const,
  },
  text: {
    color: 'white',
  },
};
