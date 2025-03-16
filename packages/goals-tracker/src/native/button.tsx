import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors, fontSizes, roundeds } from '../tokens';

export interface ButtonProps extends RectButtonProps {}

export function Button({ children, style, enabled, onPress }: ButtonProps) {
  return (
    <RectButton enabled={enabled} style={[styles.button, !enabled && styles.button_disabled, style]} onPress={onPress}>
      <View accessible accessibilityRole="button">
        <Text style={styles.text}>{children}</Text>
      </View>
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
  button_disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors['white'],
    fontSize: fontSizes['md'],
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
