import { getHeaderTitle, Header as ReactNavigationHeader } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { ChipButton, IconButton } from 'goals-react/native';
import { colors } from 'goals-react/tokens';
import { Text, View } from 'react-native';

import { useAppState } from '~/app/states';
import { config } from '~/app/utils/config';

function HeaderLeft() {
  return (
    <View className="flex-row items-center">
      <Image source={require('~/assets/logo.svg')} style={{ width: 36, height: 36 }} />
      <Text className="ml-2 text-2xl font-semibold text-white">Goals Tracker</Text>
    </View>
  );
}

function HeaderRight() {
  return (
    <ChipButton leftIcon={<Image source={require('~/assets/coin.svg')} style={{ width: 16, height: 16 }} />}>
      24 coins
    </ChipButton>
  );
}

export function Header({ options, back, route }: NativeStackHeaderProps) {
  const onChangeGoalOpen = useAppState(state => state.onChangeGoalOpen);
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
      <View className="flex-row justify-between bg-blue-500 p-4">
        <View className="items-center justify-center rounded-full bg-blue-300 px-3 py-0">
          <Text className="font-regular text-md text-white">Manter calorias diárias abaixo de 200</Text>
        </View>
        <IconButton source={require('~/assets/swap.svg')} onPress={onChangeGoalOpen} />
      </View>
    </>
  );
}
