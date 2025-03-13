import { FlashList } from '@shopify/flash-list';
import { FAB } from 'goals-react/native';
import { View } from 'react-native';

import { DayCard } from '~/app/components/day-card';
import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';

export default function Native() {
  const onGoalOpen = useAppState(state => state.onCreateGoalOpen);

  return (
    <View className="flex-1 items-stretch justify-center">
      <View className="w-full flex-1 pt-4">
        <FlashList
          contentContainerStyle={{
            paddingLeft: config.screenPadding - DayCard.cardMargin,
            paddingRight: config.screenPadding - DayCard.cardMargin,
          }}
          data={
            [
              { day: new Date(), status: 'pending' },
              { day: new Date(), status: 'success', isBought: true },
              { day: new Date(), status: 'success' },
              { day: new Date(), status: 'pending_today' },
              { day: new Date(), status: 'error' },
            ] as const
          }
          estimatedItemSize={100}
          numColumns={5}
          renderItem={({ item, index }) => {
            return (
              <View className="flex-1 items-center justify-center">
                <DayCard count={index + 1} day={item.day} isBought={!!item.isBought} status={item.status} />
              </View>
            );
          }}
        />
      </View>
      <FAB source={require('~/assets/plus.svg')} onPress={onGoalOpen} />
    </View>
  );
}
