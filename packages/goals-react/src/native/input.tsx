import React, { forwardRef, useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fontSizes, roundeds } from '../tokens';

function maskValue(value: string, mask: string): string {
  let result = '';
  let valueIndex = 0;
  value = value.replace(/[^0-9]/g, '');
  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    const maskChar = mask[i];
    const valueChar = value[valueIndex];
    if (maskChar === '#') {
      result += valueChar;
      valueIndex++;
    } else {
      result += maskChar;
    }
  }

  return result;
}

const fontSize = fontSizes['md'];
const paddingHorizontal = 16;
const paddingVertical = 12;
const labelPaddingHorizontal = 8;
const labelLeft = paddingHorizontal - labelPaddingHorizontal;
const labelTop = paddingVertical + 1;
const rightIconRight = paddingHorizontal - 4;

export interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  allowOnlyNumbers?: boolean;
  maskNumber?: string;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ containerStyle, style, maskNumber, allowOnlyNumbers, rightIcon, ...props }, ref) => {
    const [focus, setFocus] = useState(false);
    const top = useSharedValue(labelTop);
    const left = useSharedValue(labelLeft);
    const scale = useSharedValue(1);

    function moveLabelUp() {
      top.value = withTiming(-fontSize / 2);
      left.value = withTiming(labelLeft / 2);
      scale.value = withTiming(0.75);
    }

    function moveLabelDown() {
      top.value = withTiming(labelTop);
      left.value = withTiming(labelLeft);
      scale.value = withTiming(1);
    }

    function onChangeText(text: string) {
      if (allowOnlyNumbers) text = text.replace(/[^0-9]/g, '');
      if (maskNumber) text = maskValue(text, maskNumber);
      if (props.onChangeText) props.onChangeText(text);
    }

    function onBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
      setFocus(false);
      if (props.onBlur) props.onBlur(e);
      const value = props.value ?? e.nativeEvent.text;
      if (!value) moveLabelDown();
    }

    function onFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
      setFocus(true);
      if (props.onFocus) props.onFocus(e);
      moveLabelUp();
    }

    useEffect(() => {
      if (!focus && props.value) moveLabelUp();
    }, [props.value]);

    return (
      <View style={[styles.container, containerStyle]}>
        <Animated.Text style={[styles.label_text, { top: top, left: left, transform: [{ scale: scale }] }]}>
          {props.label}
        </Animated.Text>
        <TextInput
          {...props}
          maxLength={maskNumber ? maskNumber.length : props.maxLength}
          placeholder={props.label}
          placeholderTextColor={colors['transparent']}
          ref={ref}
          style={[styles.input, focus && styles.input_focus, !!rightIcon && styles.input_right_icon, style]}
          onBlur={onBlur}
          onChange={e => console.log('onChange', e.nativeEvent.text)}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
        {rightIcon && <View style={styles.right_icon}>{rightIcon}</View>}
      </View>
    );
  },
) as React.ForwardRefExoticComponent<InputProps & React.RefAttributes<TextInput>> & {
  fontSize: number;
  paddingHorizontal: number;
  paddingVertical: number;
};

Input.displayName = 'Input';
Input.paddingHorizontal = paddingHorizontal;
Input.paddingVertical = paddingVertical;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors['gray-500'],
    borderRadius: roundeds['md'],
    borderWidth: 1,
    color: colors['gray-700'],
    fontSize: fontSize,
    paddingHorizontal: paddingHorizontal,
    paddingVertical: paddingVertical,
  },
  input_focus: {
    borderColor: colors['blue-500'],
    borderWidth: 2,
    elevation: 2,
    margin: -1,
    shadowColor: colors['blue-500'],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input_right_icon: {
    paddingRight: 48,
  },
  label_text: {
    backgroundColor: colors.white,
    color: colors['gray-500'],
    fontSize: fontSize,
    left: labelLeft,
    paddingHorizontal: labelPaddingHorizontal,
    pointerEvents: 'none',
    position: 'absolute',
    top: labelTop,
    zIndex: 1,
  },
  right_icon: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: rightIconRight,
    top: 0,
  },
});
