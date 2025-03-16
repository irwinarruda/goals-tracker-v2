import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors, roundeds } from '../tokens';

const paddingHorizontal = 6;
const paddingVertical = 2;

export interface ChipButtonProps extends RectButtonProps {
  leftIcon?: React.ReactNode;
  active?: boolean;
}

export function ChipButton({ children, leftIcon, active, enabled, onPress }: ChipButtonProps) {
  return (
    <RectButton enabled={enabled} style={[styles.button, active && styles.button_active]} onPress={onPress}>
      <View accessible accessibilityRole="button" style={styles.button_view}>
        {leftIcon}
        {leftIcon && <View style={styles.left_divider} />}
        <Text style={styles.text}>{children}</Text>
      </View>
    </RectButton>
  );
}

ChipButton.paddingHorizontal = paddingHorizontal;
ChipButton.paddingVertical = paddingVertical;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderRadius: roundeds['full'],
    maxWidth: 200,
    paddingHorizontal: paddingHorizontal,
    paddingVertical: paddingVertical,
    textAlign: 'center',
  },
  button_active: {
    borderColor: colors['yellow-500'],
    borderWidth: 1,
  },
  button_view: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  left_divider: {
    marginRight: 2,
  },
  text: {
    color: colors['yellow-500'],
    fontFamily: 'Roboto',
    fontWeight: 500,
  },
});
