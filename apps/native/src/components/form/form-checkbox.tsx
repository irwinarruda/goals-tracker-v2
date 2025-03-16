import { Checkbox, CheckboxProps } from 'goals-tracker/native';
import { Control, useController } from 'react-hook-form';

export interface FormCheckboxProps extends CheckboxProps {
  name: string;
  control?: Control<any, any>;
}

export function FormCheckbox({ name, control, ...props }: FormCheckboxProps) {
  const {
    field: { value, onChange },
  } = useController({ name, control });
  return <Checkbox value={value} onValueChange={onChange} {...props} />;
}
