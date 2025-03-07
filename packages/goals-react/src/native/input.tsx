import React, { forwardRef, useState } from 'react';
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

import { colors } from '../tokens';

const fontSize = 16;
const paddingHorizontal = 16;
const paddingVertical = 12;
const labelPaddingHorizontal = 8;
const labelLeft = paddingHorizontal - labelPaddingHorizontal;
const labelTop = paddingVertical + 1;

export interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ containerStyle, style, ...props }, ref) => {
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

    function onBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
      setFocus(false);
      if (props.onBlur) props.onBlur(e);
      const text = e.nativeEvent.text;
      if (!text) moveLabelDown();
    }

    function onFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
      setFocus(true);
      if (props.onFocus) props.onFocus(e);
      moveLabelUp();
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <Animated.Text
          style={[
            styles.label_text,
            {
              top: top,
              left: left,
              transform: [{ scale: scale }],
            },
          ]}
        >
          {props.label}
        </Animated.Text>
        <TextInput
          placeholder={props.label}
          placeholderTextColor={colors['transparent']}
          ref={ref}
          style={[styles.input, focus && styles.input_focus, style]}
          onBlur={onBlur}
          onFocus={onFocus}
          {...props}
        />
      </View>
    );
  },
) as React.ForwardRefExoticComponent<InputProps & React.RefAttributes<TextInput>> & {
  fontSize: number;
  paddingHorizontal: number;
  paddingVertical: number;
};

Input.displayName = 'Input';
Input.fontSize = fontSize;
Input.paddingHorizontal = paddingHorizontal;
Input.paddingVertical = paddingVertical;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors['gray-500'],
    borderRadius: 4,
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
});
