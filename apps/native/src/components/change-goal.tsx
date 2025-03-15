import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlashList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { colors } from 'goals-react/tokens';
import { useRef } from 'react';
import { Text, View } from 'react-native';

import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';

import { GoalCard } from './goal-card';

const textAndHandleSize = 63;
const dividerSize = 12;

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

export function ChangeGoal() {
  const goals = useAppState(state => state.goals);
  const onChangeGoalClose = useAppState(state => state.onChangeGoalClose);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapSize = Math.min(700, 40 + textAndHandleSize + (GoalCard.height + dividerSize) * goals.length);
  const listSize = Math.min(600, textAndHandleSize + (GoalCard.height + dividerSize) * goals.length);

  function onGoalChange() {}

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: colors['pink-500'],
        width: 50,
      }}
      ref={bottomSheetRef}
      snapPoints={[snapSize]}
      style={{ width: '100%' }}
      enablePanDownToClose
      onClose={onChangeGoalClose}
    >
      <BottomSheetView className="w-full items-stretch px-4" style={{ paddingHorizontal: config.screenPadding }}>
        <Text className="text-2xl text-gray-700">Change Goal</Text>
        <View className="pt-3" />
      </BottomSheetView>
      <View style={{ height: listSize }}>
        <BottomSheetFlashList
          contentContainerStyle={{ paddingHorizontal: config.screenPadding }}
          data={goals}
          estimatedItemSize={80}
          renderItem={({ item, index }) => {
            return (
              <View className={index === 0 ? undefined : 'pt-3'}>
                <GoalCard goal={item} onPress={onGoalChange} />
              </View>
            );
          }}
        />
      </View>
    </BottomSheet>
  );
}
