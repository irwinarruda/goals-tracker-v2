import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Image } from 'expo-image';
import { date, Goal, GoalDay, GoalDayStatus } from 'goals-tracker/logic';
import { Button, useTheme } from 'goals-tracker/native';
import { colors } from 'goals-tracker/tokens';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as v from 'valibot';

import { FormInput } from '~/app/components/form/form-input';
import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';
import { error } from '~/app/utils/error';

const markdownTheme = {
  primaryHeading: colors['pink-500'],
  bodyText: colors['black'],
};

const styles = StyleSheet.create({
  body: { color: markdownTheme.bodyText },
  heading1: { color: markdownTheme.primaryHeading },
  heading2: { color: markdownTheme.primaryHeading },
  heading3: { color: markdownTheme.primaryHeading },
  heading4: { color: markdownTheme.primaryHeading },
  heading5: { color: markdownTheme.primaryHeading },
  heading6: { color: markdownTheme.primaryHeading },
  paragraph: { color: markdownTheme.bodyText },
});

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={1.5} />;
}

export function ViewDay() {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const isViewDayOpen = useAppState(state => state.isViewDayOpen);
  const selectedGoal = useAppState(state => state.selectedGoal);
  const viewGoalDay = useAppState(state => state.viewGoalDay);
  const onViewDayClose = useAppState(state => state.onViewDayClose);

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (!isViewDayOpen) bottomSheetRef.current.close();
      else bottomSheetRef.current.expand();
    }
  }, [isViewDayOpen]);

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
      snapPoints={['75%']}
      enablePanDownToClose
      onClose={onViewDayClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView
          className="flex-1 items-stretch py-4 dark:bg-blue-900"
          style={{ paddingHorizontal: config.screenPadding }}
        >
          {selectedGoal && viewGoalDay && <ViewDayModal selectedGoal={selectedGoal} viewGoalDay={viewGoalDay} />}
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

const AddNoteFormSchema = v.object({
  note: v.pipe(
    v.string(),
    v.minLength(1, 'Please enter a note'),
    v.maxLength(500, 'Note is too long (maximum 500 characters)'),
  ),
});

type AddNoteForm = v.InferOutput<typeof AddNoteFormSchema>;

function AddNoteFormUI({ goalDay }: { goalDay: GoalDay }) {
  const updateGoalDayNote = useAppState(state => state.updateGoalDayNote);
  const onAddNoteClose = useAppState(state => state.onAddNoteClose);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<AddNoteForm>({
    resolver: valibotResolver(AddNoteFormSchema),
    defaultValues: {
      note: '',
    },
  });

  async function onSubmit(data: AddNoteForm) {
    await updateGoalDayNote(goalDay, data.note);
  }

  return (
    <View className="flex-1">
      <FormInput
        control={control}
        label="Add a note for this day"
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
          style={{ flex: 1, backgroundColor: colors['gray-700'] }}
          onPress={onAddNoteClose}
        >
          Cancel
        </Button>
        <Button enabled={!isSubmitting} style={{ flex: 1 }} onPress={() => error.listenAsync(handleSubmit(onSubmit))()}>
          Save Note
        </Button>
      </View>
    </View>
  );
}

function ViewDayModal({ selectedGoal, viewGoalDay }: { selectedGoal: Goal; viewGoalDay: GoalDay }) {
  const isAddNoteOpen = useAppState(state => state.isAddNoteOpen);
  const onAddNoteOpen = useAppState(state => state.onAddNoteOpen);

  return (
    <>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl text-black dark:text-white">View Day</Text>
        <View className="flex-row items-center justify-end gap-2">
          <ViewDayGoal goal={selectedGoal} />
          <ViewDayUI goalDay={viewGoalDay} />
        </View>
      </View>
      <Divider />
      {viewGoalDay.note ? (
        <View className="rounded-lg bg-gray-100 p-3">
          <Markdown style={styles}>{viewGoalDay.note}</Markdown>
        </View>
      ) : isAddNoteOpen ? (
        <AddNoteFormUI goalDay={viewGoalDay} />
      ) : (
        <View className="flex-1 items-center justify-start">
          <Image source={require('~/assets/not-found.svg')} style={{ marginTop: 30, width: 280, height: 280 }} />
          <Text className="text-md w-[300] text-center font-normal text-black dark:text-white">
            No notes for this day
          </Text>
          <View className="pt-5" />
          <Button style={{ backgroundColor: colors['pink-500'], width: 200 }} onPress={onAddNoteOpen}>
            Add Note
          </Button>
        </View>
      )}
    </>
  );
}

function goalDayStatusToColor(status: GoalDayStatus) {
  switch (status) {
    case GoalDayStatus.Success:
      return colors['green-500'];
    case GoalDayStatus.Error:
      return colors['pink-700'];
    case GoalDayStatus.Pending:
      return colors['gray-500'];
    case GoalDayStatus.PendingToday:
      return colors['blue-500'];
    default:
      return colors['gray-500'];
  }
}

function ViewDayUI({ goalDay }: { goalDay: GoalDay }) {
  return (
    <View
      className="rounded-lg p-2"
      style={{
        backgroundColor: goalDayStatusToColor(goalDay.status),
        ...(goalDay.isBought && { borderColor: colors['yellow-500'], borderWidth: 4 }),
      }}
    >
      <View className="items-center">
        <View className="flex-row gap-1">
          <Text className="text-md font-bold text-white">Day</Text>
          <Text className="text-md font-bold text-white">{goalDay.count}</Text>
        </View>
        <View className="flex-row gap-1">
          <Text className="text-xs text-white">{date.getWeekDay(date.normalizeTZ(date.toDate(goalDay.date)))}</Text>
          <Text className="text-xs font-normal text-white">
            {date.getDayMonth(date.normalizeTZ(date.toDate(goalDay.date)))}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ViewDayGoal({ goal }: { goal: Goal }) {
  return (
    <View className="w-40 justify-center rounded-lg bg-blue-500 px-2 py-2">
      <Text className="text-md font-bold text-white" ellipsizeMode="tail" numberOfLines={1}>
        {goal.description}
      </Text>
      <Text className="text-xs text-white">Started {date.getDayMonthYear(date.toDate(goal.days[0].date))}</Text>
    </View>
  );
}

function Divider() {
  return (
    <>
      <View className="pt-3" />
      <View className="h-px w-full bg-gray-300" />
      <View className="pt-3" />
    </>
  );
}
