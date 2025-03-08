import { Checkbox as RNCheckBox, CheckboxProps as RNCheckBoxProps } from 'expo-checkbox';
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

import { colors } from '../tokens';

export interface CheckBoxProps extends RNCheckBoxProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  checkboxStyle?: StyleProp<ViewStyle>;
}

export function CheckBox({ label, containerStyle, labelStyle, style, value = false, ...props }: CheckBoxProps) {
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
    const text = props.disabled && label;
    return <Text style={[styles.label, props.disabled && styles.disabledLabel, labelStyle]}>{text}</Text>;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={props.disabled}
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <RNCheckBox {...props} style={[styles.checkbox, style]} value={value} onValueChange={onValueChange} />
      {renderLabel()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    // Default styles for the checkbox
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
    color: colors['gray-700'],
    flex: 1,
    fontSize: 16,
  },
});
