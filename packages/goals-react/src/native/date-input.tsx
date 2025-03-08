import React, { forwardRef, useState } from 'react';
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

export type DateInputProps = InputProps;

export const DateInput = forwardRef<React.ElementRef<typeof TextInput>, InputProps>((props, ref) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  function onCalendarPress() {
    setShowDatePicker(true);
  }

  function onDateChange(date?: Date) {
    setShowDatePicker(false);
    if (!date) return;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    if (props.onChangeText) props.onChangeText(`${day}/${month}/${year}`);
  }

  return (
    <>
      <Input
        {...props}
        maskNumber="##/##/####"
        ref={ref}
        rightIcon={
          <IconButton backgroundColor={colors['transparent']} icon={<CalendarIcon />} onPress={onCalendarPress} />
        }
      />
      <DateTimePickerModal isVisible={showDatePicker} mode="date" onCancel={onDateChange} onConfirm={onDateChange} />
    </>
  );
});

DateInput.displayName = 'DateInput';
