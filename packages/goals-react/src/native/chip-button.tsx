import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors } from '../tokens';

export type ChipButtonProps = RectButtonProps & {
  leftIcon?: React.ReactNode;
  active?: boolean;
};

export function ChipButton({ children, leftIcon, active, onPress }: ChipButtonProps) {
  return (
    <RectButton style={[styles.button, active && styles.button_active]} onPress={onPress}>
      {leftIcon}
      {leftIcon && <View style={styles.leftDivider} />}
      <Text style={styles.text}>{children}</Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 1000,
    flexDirection: 'row',
    fontSize: 15,
    maxWidth: 200,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  button_active: {
    borderColor: colors['yellow-500'],
    borderWidth: 1,
  },
  leftDivider: {
    marginRight: 2,
  },
  text: {
    color: colors['yellow-500'],
    fontFamily: 'Roboto',
    fontWeight: 500,
  },
});
