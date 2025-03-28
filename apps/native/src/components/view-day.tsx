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

/**
 * Renders a BottomSheetBackdrop that automatically disappears when the bottom sheet is closed.
 *
 * This function returns a BottomSheetBackdrop component with its `disappearsOnIndex`
 * prop set to -1, ensuring that the backdrop is hidden when the bottom sheet's index is -1.
 *
 * @param props - The properties to apply to the BottomSheetBackdrop.
 * @returns A React element representing the configured backdrop.
 */
function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

/**
 * Renders a bottom sheet modal displaying detailed information for a selected goal on a specific day.
 *
 * This React component uses a bottom sheet from the @gorhom/bottom-sheet library to conditionally display
 * the details of a selected goal and its associated day information. The modal expands when the global
 * state flag `isViewDayOpen` is true and closes when it is false. Its content is rendered only if both a 
 * selected goal and corresponding day details are available.
 */
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

/**
 * Renders a modal view displaying details for a specific day of a selected goal.
 *
 * This component shows the goal's description and its start date (derived from the first day in the goal's history),
 * alongside visual status details using a dedicated UI component. It conditionally displays a markdown-formatted note
 * if one exists for the day; otherwise, it presents a placeholder image and message indicating that no notes are available.
 *
 * @param selectedGoal - The goal object encompassing the description and associated days.
 * @param viewDayGoalDay - The specific day's details for the goal, including any note.
 */
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

/**
 * Maps a goal day status to its corresponding color.
 *
 * Returns a specific color for each recognized status:
 * - Success: green.
 * - Error: pink.
 * - Pending: gray.
 * - PendingToday: blue.
 *
 * If the status is unrecognized, returns 'Unknown'.
 *
 * @param status - The goal day status to convert.
 * @returns The color associated with the given status.
 */
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
      return 'Unknown';
  }
}

/**
 * Renders a UI element displaying a goal day's status.
 *
 * This component shows the day count alongside formatted weekday and month/date information. The background color is set based on the goal day's status.
 *
 * @param goalDay - An object containing details of the goal day, including its status, count, and date.
 */
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

/**
 * Renders a visual divider.
 *
 * This component renders a horizontal line with padding above and below,
 * typically used to separate sections within the UI.
 */
function Divider() {
  return (
    <>
      <View className="pt-3" />
      <View className="h-px w-full bg-gray-300" />
      <View className="pt-3" />
    </>
  );
}
