import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlashList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { colors } from 'goals-tracker/tokens';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';
import { error } from '~/app/utils/error';

import { GoalCard } from './goal-card';

const textAndHandleSize = 63;
const dividerSize = 12;

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

export function ChangeGoal() {
  const goals = useAppState(state => state.goals);
  const isChangeGoalOpen = useAppState(state => state.isChangeGoalOpen);
  const selectedGoalId = useAppState(state => state.selectedGoalId);
  const onChangeGoalClose = useAppState(state => state.onChangeGoalClose);
  const changeGoal = useAppState(state => state.changeGoal);
  const removeGoal = useAppState(state => state.removeGoal);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const rawListSize = textAndHandleSize + (GoalCard.height + dividerSize) * goals.length;
  const snapSize = Math.min(700, Math.max(400, 40 + rawListSize));
  const listSize = Math.min(600, rawListSize);

  async function onGoalChange(id: string) {
    await changeGoal(id);
  }

  async function onGoalDelete(id: string) {
    await removeGoal(id);
  }

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (!isChangeGoalOpen) bottomSheetRef.current.close();
      else bottomSheetRef.current.expand();
    }
  }, [isChangeGoalOpen]);

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
      snapPoints={[snapSize]}
      style={{ width: '100%' }}
      enablePanDownToClose
      onClose={onChangeGoalClose}
    >
      <BottomSheetView className="w-full items-stretch px-4" style={{ paddingHorizontal: config.screenPadding }}>
        <Text className="text-2xl text-black">Change Goal</Text>
        <View className="pt-3" />
      </BottomSheetView>
      <View style={{ height: listSize }}>
        <BottomSheetFlashList
          contentContainerStyle={{ paddingHorizontal: config.screenPadding }}
          data={goals}
          estimatedItemSize={80}
          extraData={selectedGoalId}
          renderItem={({ item, extraData, index }) => {
            return (
              <View className={index === 0 ? undefined : 'pt-3'} key={item.id}>
                <GoalCard
                  accessibilityHint="Long press to delete this goal"
                  goal={item}
                  selected={extraData === item.id}
                  onLongPress={() => error.listenAsync(onGoalDelete)(item.id)}
                  onPress={() => error.listenAsync(onGoalChange)(item.id)}
                />
              </View>
            );
          }}
        />
      </View>
    </BottomSheet>
  );
}
