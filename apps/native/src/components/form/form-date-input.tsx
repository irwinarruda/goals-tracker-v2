import { DateInput, DateInputProps } from 'goals-tracker/native';
import { Control, useController } from 'react-hook-form';

export interface FormDateInputProps extends DateInputProps {
  name: string;
  control?: Control<any, any>;
}

export function FormDateInput({ name, control, ...props }: FormDateInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });
  return <DateInput error={error?.message} value={value} onChangeText={onChange} {...props} />;
}
