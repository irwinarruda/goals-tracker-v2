import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

export type ButtonProps = RectButtonProps;

export function Button({ children, onPress }: ButtonProps) {
  return (
    <RectButton style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2f80ed',
    borderRadius: 10,
    fontSize: 15,
    maxWidth: 200,
    paddingBottom: 14,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 14,
    textAlign: 'center',
  },
  text: {
    color: 'white',
  },
});
