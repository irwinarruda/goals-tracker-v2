import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fontSizes, roundeds } from '../tokens';
import { Theme, useTheme } from './theme';

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined | null>) {
  return (instance: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = instance;
      }
    });
  };
}

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
const errorPaddingHorizontal = 8;
const errorLeft = paddingHorizontal - errorPaddingHorizontal;
const errorBottom = -4;

export interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  allowOnlyNumbers?: boolean;
  maskNumber?: string;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ containerStyle, style, maskNumber, allowOnlyNumbers, rightIcon, error, ...props }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const internalRef = useRef<TextInput>(null);

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

    function onLabelPress() {
      if (internalRef.current) internalRef.current.focus();
    }

    useEffect(() => {
      if (!focus) {
        if (props.value) moveLabelUp();
        else moveLabelDown();
      }
    }, [props.value]);

    return (
      <View style={[styles.container, props.editable === false && styles.container_disabled, containerStyle]}>
        <Animated.Text
          style={[styles.label_text, { top: top, left: left, transform: [{ scale: scale }] }]}
          onPress={onLabelPress}
        >
          {props.label}
        </Animated.Text>
        <TextInput
          {...props}
          maxLength={maskNumber ? maskNumber.length : props.maxLength}
          placeholder={props.label}
          placeholderTextColor={colors['transparent']}
          // eslint-disable-next-line react-compiler/react-compiler
          ref={mergeRefs(ref, internalRef)}
          style={[
            styles.input,
            focus && styles.input_focus,
            !!rightIcon && styles.input_right_icon,
            !!error && styles.input_error,
            style,
          ]}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
        {rightIcon && <View style={styles.right_icon}>{rightIcon}</View>}
        {error && <Text style={[!!error && styles.error_text]}>{error}</Text>}
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

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'relative',
    },
    container_disabled: {
      opacity: 0.6,
    },
    error_text: {
      backgroundColor: theme.backgroundColor,
      bottom: errorBottom,
      color: colors['pink-500'],
      fontSize: fontSizes['2xs'],
      left: errorLeft,
      paddingHorizontal: errorPaddingHorizontal,
      position: 'absolute',
      zIndex: 1,
    },
    input: {
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
      borderRadius: roundeds['md'],
      borderWidth: 1,
      color: theme.textColor,
      fontSize: fontSize,
      paddingHorizontal: paddingHorizontal,
      paddingVertical: paddingVertical,
    },
    input_error: {
      borderColor: colors['pink-500'],
      shadowColor: colors['pink-500'],
    },
    input_focus: {
      borderColor: colors['blue-500'],
      borderWidth: 2,
      elevation: 2,
      margin: -1,
      shadowColor: colors['blue-500'],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    input_right_icon: {
      paddingRight: 48,
    },
    label_text: {
      backgroundColor: theme.backgroundColor,
      color: theme.subTextColor,
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
}
