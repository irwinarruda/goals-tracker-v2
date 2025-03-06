import { FlashList } from '@shopify/flash-list';
import { FAB } from 'goals-react/native';
import { View } from 'react-native';

import { DayCard } from '~/app/components/day-card';

export default function Native() {
  return (
    <View className="flex-1 items-stretch justify-center">
      <View className="w-full flex-1 pt-4">
        <FlashList
          contentContainerStyle={{ paddingLeft: 16 - DayCard.cardMargin, paddingRight: 16 - DayCard.cardMargin }}
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
      <FAB source={require('~/assets/plus.svg')} />
    </View>
  );
}
