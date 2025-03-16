import { Input, InputProps } from 'goals-tracker/native';
import { Control, useController } from 'react-hook-form';

export interface FormInputProps extends InputProps {
  name: string;
  control?: Control<any, any>;
}

export function FormInput({ name, control, ...props }: FormInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });
  return <Input error={error?.message} value={value} onChangeText={onChange} {...props} />;
}
