import { Checkbox as RNCheckbox, CheckboxProps as RNCheckboxProps } from 'expo-checkbox';
import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { colors, fontSizes, roundeds } from '../tokens';
import { Theme, useTheme } from './theme';

export interface CheckboxProps extends RNCheckboxProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Checkbox({ label, containerStyle, labelStyle, value = false, ...props }: CheckboxProps) {
  const styles = createStyles(useTheme());

  function onPress(e: GestureResponderEvent) {
    e.preventDefault();
    if (props.disabled) return;
    if (props.onValueChange) props.onValueChange(!value);
  }

  function onValueChange(newValue: boolean) {
    if (props.onValueChange) props.onValueChange(newValue);
  }

  function renderLabel() {
    if (!label) return null;
    return <Text style={[styles.label, props.disabled && styles.disabledLabel, labelStyle]}>{label}</Text>;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={props.disabled}
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <RNCheckbox
        {...props}
        color={props.color ?? colors['pink-500']}
        style={[styles.checkbox, props.style]}
        value={value}
        onValueChange={onValueChange}
      />
      {renderLabel()}
    </TouchableOpacity>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    checkbox: {
      borderRadius: roundeds['sm'],
    },
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 9,
    },
    disabledLabel: {
      color: colors['gray-500'],
    },
    label: {
      color: theme.textColor,
      flex: 1,
      fontSize: fontSizes['sm'],
      marginLeft: 8,
    },
  });
}
