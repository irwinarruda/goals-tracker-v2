import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button } from 'goals-tracker/native';
import { colors } from 'goals-tracker/tokens';
import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import * as v from 'valibot';

import { useFormTrigger } from '~/app/providers/form-trigger';
import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';
import { error } from '~/app/utils/error';

import { FormCheckbox } from './form/form-checkbox';
import { FormDateInput } from './form/form-date-input';
import { FormInput } from './form/form-input';

const CreateGoalFormSchema = v.lazy((input: any) => {
  return v.object({
    description: v.pipe(v.string(), v.minLength(4, 'Description must be at least 4 characters')),
    days: v.pipe(
      v.string(),
      v.minLength(1, 'Required'),
      v.maxLength(3, 'Less than 999.'),
      v.regex(/[0-9]/g, 'Must be a number.'),
    ),
    date: v.pipe(v.string(), v.isoDate('Date must be in ISO format')),
    useCoins: v.pipe(v.boolean()),
    coins: !input.useCoins
      ? v.pipe(v.string())
      : v.pipe(v.string(), v.minLength(1, 'Required'), v.regex(/[0-9]/g, 'Number.')),
  });
});

type CreateGoalForm = v.InferOutput<typeof CreateGoalFormSchema>;

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

/**
 * Renders a bottom sheet form for creating a new goal.
 *
 * This component displays a modal-like interface that allows users to enter a goal description, duration in days, and start date.
 * It optionally accepts coin usage details, enabling an additional input for specifying coins if activated.
 * The form is managed using react-hook-form with validation provided by valibot. Upon submission, numeric fields are converted appropriately
 * and passed to a global handler to create the goal. The bottom sheet automatically expands or collapses based on a global state flag.
 *
 * @returns The JSX for the bottom sheet form.
 */
export function CreateGoal() {
  const {
    handleSubmit,
    trigger,
    control,
    formState: { isSubmitting },
  } = useForm<CreateGoalForm>({
    resolver: valibotResolver(CreateGoalFormSchema),
    defaultValues: {
      description: '',
      days: '',
      date: '',
      useCoins: false,
      coins: '',
    },
  });
  const useCoins = useWatch({ control, name: 'useCoins' });
  const isCreateGoalOpen = useAppState(state => state.isCreateGoalOpen);
  const onCreateGoalClose = useAppState(state => state.onCreateGoalClose);
  const createGoal = useAppState(state => state.createGoal);
  const bottomSheetRef = useRef<BottomSheet>(null);

  async function onSubmit(data: CreateGoalForm) {
    await createGoal({
      date: data.date,
      days: Number(data.days),
      description: data.description,
      useCoins: data.useCoins,
      coins: Number(data.coins),
    });
  }

  useFormTrigger<CreateGoalForm>({
    when: 'useCoins',
    trigger: 'coins',
    control,
    triggerFn: trigger,
  });

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (!isCreateGoalOpen) bottomSheetRef.current.close();
      else bottomSheetRef.current.expand();
    }
  }, [isCreateGoalOpen]);

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: colors['pink-500'],
        width: 50,
      }}
      index={-1}
      ref={bottomSheetRef}
      snapPoints={[400]}
      enablePanDownToClose
      onClose={onCreateGoalClose}
    >
      <BottomSheetView className="flex-1 items-stretch py-4" style={{ paddingHorizontal: config.screenPadding }}>
        <Text className="text-2xl text-black">Create Goal</Text>
        <View className="pt-5" />
        <FormInput control={control} label="Description" name="description" placeholder="Enter a goal description" />
        <View className="flex-row gap-5 pt-5">
          <FormInput
            containerStyle={{ flex: 1 }}
            control={control}
            keyboardType="numeric"
            label="Days"
            maxLength={3}
            name="days"
            allowOnlyNumbers
          />
          <FormDateInput
            containerStyle={{ flex: 2 }}
            control={control}
            keyboardType="numeric"
            label="Start date"
            name="date"
          />
        </View>
        <View className="flex-row items-center gap-5 pt-5">
          <FormCheckbox
            containerStyle={{ flex: 3 }}
            control={control}
            label="Use coins to complete a the day"
            name="useCoins"
          />
          <FormInput
            containerStyle={{ flex: 1 }}
            control={control}
            editable={useCoins}
            keyboardType="numeric"
            label="Coins"
            maxLength={2}
            name="coins"
            allowOnlyNumbers
          />
        </View>
        <View className="pt-5" />
        <Button enabled={!isSubmitting} onPress={() => error.listen(handleSubmit(onSubmit))()}>
          Create
        </Button>
      </BottomSheetView>
    </BottomSheet>
  );
}
