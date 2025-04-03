import React, { forwardRef, useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Path, Svg } from 'react-native-svg';

import { colors } from '../tokens';
import { IconButton } from './icon-button';
import { Input, InputProps } from './input';

function CalendarIcon() {
  return (
    <Svg fill="none" height="17" viewBox="0 0 17 17" width="17">
      <Path
        d="M13.4583 13.4583H3.54167V5.66665H13.4583M11.3333 0.708313V2.12498H5.66667V0.708313H4.25V2.12498H3.54167C2.75542 2.12498 2.125 2.7554 2.125 3.54165V13.4583C2.125 13.834 2.27426 14.1944 2.53993 14.46C2.80561 14.7257 3.16594 14.875 3.54167 14.875H13.4583C13.8341 14.875 14.1944 14.7257 14.4601 14.46C14.7257 14.1944 14.875 13.834 14.875 13.4583V3.54165C14.875 3.16592 14.7257 2.80559 14.4601 2.53991C14.1944 2.27424 13.8341 2.12498 13.4583 2.12498H12.75V0.708313M12.0417 8.49998H8.5V12.0416H12.0417V8.49998Z"
        fill="#2D3B42"
      />
    </Svg>
  );
}

function formatDateToDisplay(isoDateString?: string) {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

function parseDisplayToIsoDate(displayDateString?: string) {
  if (!displayDateString) return '';
  const parts = displayDateString.split('/');
  if (parts.length !== 3) return '';
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  try {
    const strDate = `${year}-${month}-${day}`;
    const date = new Date(strDate);
    if (isNaN(date.getTime())) return '';
    return strDate;
  } catch {
    return '';
  }
}

export interface DateInputProps extends InputProps {}

export const DateInput = forwardRef<React.ElementRef<typeof TextInput>, DateInputProps>((props, ref) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [displayValue, setDisplayValue] = useState(formatDateToDisplay(props.value));

  function onCalendarPress() {
    setShowDatePicker(true);
  }

  function onDateChange(date?: Date) {
    setShowDatePicker(false);
    if (!date) return;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const isoDateString = `${year}-${month}-${day}`;
    if (props.onChangeText) props.onChangeText(isoDateString);
    setDisplayValue(`${day}/${month}/${year}`);
  }

  function onChangeText(text: string) {
    setDisplayValue(text);
    if (text.length === 10) {
      const isoDate = parseDisplayToIsoDate(text);
      if (isoDate && props.onChangeText) props.onChangeText(isoDate);
    } else {
      if (props.onChangeText) props.onChangeText('');
    }
  }

  useEffect(() => {
    setDisplayValue(formatDateToDisplay(props.value));
  }, [props.value]);

  return (
    <>
      <Input
        {...props}
        maskNumber="##/##/####"
        ref={ref}
        rightIcon={
          <IconButton
            backgroundColor={colors['transparent']}
            icon={<CalendarIcon />}
            size={32}
            onPress={onCalendarPress}
          />
        }
        value={displayValue}
        onChangeText={onChangeText}
      />
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onCancel={() => setShowDatePicker(false)}
        onConfirm={onDateChange}
      />
    </>
  );
});

DateInput.displayName = 'DateInput';
