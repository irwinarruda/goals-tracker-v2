import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors } from '../tokens';

const paddingHorizontal = 6;
const paddingVertical = 2;

export interface ChipButtonProps extends RectButtonProps {
  leftIcon?: React.ReactNode;
  active?: boolean;
}

export function ChipButton({ children, leftIcon, active, onPress }: ChipButtonProps) {
  return (
    <RectButton style={[styles.button, active && styles.button_active]} onPress={onPress}>
      {leftIcon}
      {leftIcon && <View style={styles.leftDivider} />}
      <Text style={styles.text}>{children}</Text>
    </RectButton>
  );
}

ChipButton.paddingHorizontal = paddingHorizontal;
ChipButton.paddingVertical = paddingVertical;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 1000,
    flexDirection: 'row',
    fontSize: 15,
    maxWidth: 200,
    paddingHorizontal: paddingHorizontal,
    paddingVertical: paddingVertical,
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
