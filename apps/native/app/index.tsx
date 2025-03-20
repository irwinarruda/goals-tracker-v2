import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { GoalDay } from 'goals-tracker/logic';
import { FAB } from 'goals-tracker/native';
import { Text, View } from 'react-native';

import { DayCard } from '~/app/components/day-card';
import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';
import { error } from '~/app/utils/error';

export default function Native() {
  const selectedGoal = useAppState(state => state.selectedGoal);
  const onGoalOpen = useAppState(state => state.onCreateGoalOpen);
  const completeGoalDay = useAppState(state => state.completeGoalDay);

  async function onDayPress(goalDay: GoalDay) {
    await completeGoalDay(goalDay);
  }

  if (!selectedGoal) {
    return (
      <View className="flex-1 items-center justify-start p-4">
        <Image source={require('~/assets/not-found.svg')} style={{ marginTop: 30, width: 280, height: 280 }} />
        <Text className="text-md w-[300] text-center font-normal text-blue-700">
          Nenhuma meta não definida, clique no botão + para adicionar
        </Text>
        <FAB source={require('~/assets/plus.svg')} onPress={onGoalOpen} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-stretch justify-center">
      <View className="w-full flex-1 pt-2">
        <FlashList
          contentContainerStyle={{
            paddingLeft: config.screenPadding - DayCard.cardMargin,
            paddingRight: config.screenPadding - DayCard.cardMargin,
          }}
          data={selectedGoal.days}
          estimatedItemSize={100}
          numColumns={5}
          renderItem={({ item }) => {
            return (
              <View
                className="flex-1 items-center justify-center"
                key={item.date.toString()}
                style={{ paddingTop: DayCard.cardMargin }}
              >
                <DayCard goalDay={item} onPress={() => error.listenAsync(onDayPress)(item)} />
              </View>
            );
          }}
        />
      </View>
      <FAB source={require('~/assets/plus.svg')} onPress={onGoalOpen} />
    </View>
  );
}
