import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors, fontSizes, roundeds } from '../tokens';

export interface ButtonProps extends RectButtonProps {}

export function Button({ children, onPress, style }: ButtonProps) {
  return (
    <RectButton style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors['pink-500'],
    borderRadius: roundeds['md'],
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
  },
  text: {
    color: colors['white'],
    fontSize: fontSizes['md'],
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
