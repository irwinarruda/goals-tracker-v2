import { getHeaderTitle, Header as ReactNavigationHeader } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { ChipButton, IconButton } from 'goals-tracker/native';
import { colors } from 'goals-tracker/tokens';
import { Text, View } from 'react-native';

import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';
import { error } from '~/app/utils/error';

function HeaderLeft() {
  return (
    <View className="flex-row items-center">
      <Image source={require('~/assets/logo.svg')} style={{ width: 36, height: 36 }} />
      <Text className="ml-2 text-2xl font-semibold text-white">Goals Tracker</Text>
    </View>
  );
}

function HeaderRight() {
  const coins = useAppState(state => state.coins);
  const canUseCoins = useAppState(state => state.canUseCoins);
  const completeTodayGoalWithCoins = useAppState(state => state.completeTodayGoalWithCoins);
  const text = coins + (coins === 1 ? ' coin' : ' coins');
  return (
    <ChipButton
      active={canUseCoins}
      leftIcon={<Image source={require('~/assets/coin.svg')} style={{ width: 16, height: 16 }} />}
      onPress={error.listenAsync(completeTodayGoalWithCoins)}
    >
      {text}
    </ChipButton>
  );
}

export function Header({ options, back, route }: NativeStackHeaderProps) {
  const onChangeGoalOpen = useAppState(state => state.onChangeGoalOpen);
  const selectedGoal = useAppState(state => state.selectedGoal);
  const goalDescription = selectedGoal?.description ?? 'Click in + to add a new goal';

  return (
    <>
      <ReactNavigationHeader
        {...options}
        back={back}
        headerLeft={HeaderLeft}
        headerLeftContainerStyle={{ paddingLeft: config.screenPadding }}
        headerRight={HeaderRight}
        headerRightContainerStyle={{ paddingRight: config.screenPadding + 1 - ChipButton.paddingHorizontal }}
        headerStyle={{ backgroundColor: colors['blue-500'] }}
        title={getHeaderTitle(options, route.name)}
      />
      <View className="flex-row justify-between gap-4 bg-blue-500 p-4">
        <View className="flex-1 justify-center rounded-full bg-blue-300 px-3 py-0">
          <Text className="font-regular text-md text-white" ellipsizeMode="tail" numberOfLines={1}>
            {goalDescription}
          </Text>
        </View>
        <IconButton source={require('~/assets/swap.svg')} onPress={error.listen(onChangeGoalOpen)} />
      </View>
    </>
  );
}
