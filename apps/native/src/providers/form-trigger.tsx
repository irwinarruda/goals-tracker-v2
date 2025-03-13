import { useEffect } from 'react';
import { Control, FieldValues, useFormState, useWatch } from 'react-hook-form';

export type FormTriggerProps<T extends FieldValues> = {
  when: keyof T;
  trigger: keyof T;
  control?: Control<any, any>;
  triggerFn?: (name: keyof T) => void;
};

export function useFormTrigger<T extends FieldValues>(props: FormTriggerProps<T>) {
  const when = useWatch<T>({ name: props.when as any, control: props.control });
  const { isSubmitted } = useFormState<T>({ control: props.control });
  useEffect(() => {
    if (isSubmitted) props.triggerFn?.(props.trigger as any);
  }, [when]);
  return null;
}
