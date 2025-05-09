import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { date } from 'goals-tracker/logic';
import { Button, useTheme } from 'goals-tracker/native';
import { colors } from 'goals-tracker/tokens';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import * as v from 'valibot';

import { AppSlices, useAppState } from '~/app/states';
import { cn } from '~/app/utils/cn';
import { config } from '~/app/utils/config';
import { error } from '~/app/utils/error';

import { FormInput } from './form/form-input';

const ConfirmDayFormSchema = v.object({
  note: v.string(),
});

type ConfirmDayForm = v.InferOutput<typeof ConfirmDayFormSchema>;

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={1.5} />;
}

export function ConfirmDay() {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<ConfirmDayForm>({
    resolver: valibotResolver(ConfirmDayFormSchema),
    defaultValues: {
      note: '',
    },
  });

  const theme = useTheme();
  const isConfirmDayOpen = useAppState(state => state.isConfirmDayOpen);
  const confirmDayData = useAppState(state => state.confirmDayData);
  const onConfirmDayConfirm = useAppState(state => state.onConfirmDayConfirm);
  const onConfirmDayCancel = useAppState(state => state.onConfirmDayCancel);
  const bottomSheetRef = useRef<BottomSheet>(null);

  async function onSubmit(data: ConfirmDayForm) {
    onConfirmDayConfirm(data.note);
  }

  function onClose() {
    onConfirmDayCancel();
    reset();
  }

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (!isConfirmDayOpen) bottomSheetRef.current.close();
      else bottomSheetRef.current.expand();
    }
  }, [isConfirmDayOpen]);

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.backgroundColor }}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: colors['pink-500'],
        width: 50,
      }}
      index={-1}
      ref={bottomSheetRef}
      snapPoints={[400]}
      enablePanDownToClose
      onClose={error.listen(onClose)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView
          className="flex-1 items-stretch py-4 dark:bg-blue-900"
          style={{ paddingHorizontal: config.screenPadding }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl text-black dark:text-white">Confirm Day</Text>
            <ConfirmData confirmDayData={confirmDayData} />
          </View>
          <View className="pt-5" />
          <FormInput
            control={control}
            label="Type in a note for today's goal"
            name="note"
            placeholder="Enter your note message"
            style={{ height: 150 }}
            textAlignVertical="top"
            multiline
          />
          <View className="pt-5" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              enabled={!isSubmitting}
              style={{
                flex: 1,
                backgroundColor: colors['gray-700'],
              }}
              onPress={onConfirmDayCancel}
            >
              Cancel
            </Button>
            <Button
              enabled={!isSubmitting}
              style={{ flex: 1 }}
              onPress={e => error.listenAsync(handleSubmit(onSubmit))()}
            >
              Confirm
            </Button>
          </View>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

function ConfirmData({ confirmDayData }: { confirmDayData: AppSlices['confirmDayData'] }) {
  if (!confirmDayData) return null;
  return (
    <View
      className={cn('-my-5 rounded-lg bg-green-500 p-2', confirmDayData.isBought && 'border-[4px] border-yellow-500')}
    >
      <View className="items-center">
        <View className="flex-row gap-1">
          <Text className="text-md font-bold text-white">Day</Text>
          <Text className="text-md font-bold text-white">{confirmDayData.goalDay.count}</Text>
        </View>
        <View className="flex-row gap-1">
          <Text className="text-xs text-white">
            {date.getWeekDay(date.normalizeTZ(date.toDate(confirmDayData.goalDay.date)))}
          </Text>
          <Text className="text-xs font-normal text-white">
            {date.getDayMonth(date.normalizeTZ(date.toDate(confirmDayData.goalDay.date)))}
          </Text>
        </View>
      </View>
    </View>
  );
}
