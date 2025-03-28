import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { date, Goal, GoalDay, GoalDayStatus } from 'goals-tracker/logic';
import { colors } from 'goals-tracker/tokens';
import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';

const styles = StyleSheet.create({
  body: { color: colors['black'] },
  heading1: { color: colors['pink-500'] },
  heading2: { color: colors['pink-500'] },
  heading3: { color: colors['pink-500'] },
  heading4: { color: colors['pink-500'] },
  heading5: { color: colors['pink-500'] },
  heading6: { color: colors['pink-500'] },
  paragraph: { color: colors['black'] },
});

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

export function ViewDay() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { isViewDayOpen, selectedGoal, viewDayGoalDay, onViewDayClose } = useAppState();

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (!isViewDayOpen) bottomSheetRef.current.close();
      else bottomSheetRef.current.expand();
    }
  }, [isViewDayOpen]);

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
      snapPoints={['75%']}
      enablePanDownToClose
      onClose={onViewDayClose}
    >
      <BottomSheetView className="flex-1 items-stretch py-4" style={{ paddingHorizontal: config.screenPadding }}>
        {selectedGoal && viewDayGoalDay && <ViewDayModal selectedGoal={selectedGoal} viewDayGoalDay={viewDayGoalDay} />}
      </BottomSheetView>
    </BottomSheet>
  );
}

function ViewDayModal({ selectedGoal, viewDayGoalDay }: { selectedGoal: Goal; viewDayGoalDay: GoalDay }) {
  return (
    <>
      <Text className="text-2xl text-black">View Day</Text>
      <Divider />
      <View className="flex-row">
        <View className="flex-1 pr-3">
          <View className="flex-1 justify-center rounded-lg bg-blue-300 px-2 py-0">
            <Text className="text-md font-bold text-white" ellipsizeMode="tail" numberOfLines={1}>
              {selectedGoal.description}
            </Text>
            <Text className="mt-px text-sm text-white">
              Started on {date.getDayMonthYear(date.toDate(selectedGoal.days[0].date))}
            </Text>
          </View>
        </View>
        <ViewDayUI goalDay={viewDayGoalDay} />
      </View>
      <Divider />
      {viewDayGoalDay.note ? (
        <View className="rounded-lg bg-gray-100 p-3">
          <Markdown style={styles}>{viewDayGoalDay.note}</Markdown>
        </View>
      ) : (
        <View className="flex-1 items-center justify-start">
          <Image source={require('~/assets/not-found.svg')} style={{ marginTop: 30, width: 280, height: 280 }} />
          <Text className="text-md w-[300] text-center font-normal text-blue-700">No notes for this day</Text>
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
      return colors['pink-500'];
    case GoalDayStatus.Pending:
      return colors['gray-500'];
    case GoalDayStatus.PendingToday:
      return colors['blue-500'];
    default:
      return colors['gray-500']; // Fallback to a safe default color
  }
}

function ViewDayUI({ goalDay }: { goalDay: GoalDay }) {
  return (
    <View className="rounded-lg p-2" style={{ backgroundColor: goalDayStatusToColor(goalDay.status) }}>
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

function Divider() {
  return (
    <>
      <View className="pt-3" />
      <View className="h-px w-full bg-gray-300" />
      <View className="pt-3" />
    </>
  );
}
