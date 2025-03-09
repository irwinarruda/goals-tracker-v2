import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Checkbox, DateInput, Input } from 'goals-react/native';
import { colors } from 'goals-react/tokens';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { config } from '~/app/utils/config';

import { useAppState } from '../states';

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

export function CreateGoal() {
  const onGoalClose = useAppState(state => state.onGoalClose);
  const createGoal = useAppState(state => state.createGoal);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [description, setDescription] = useState('');
  const [days, setDays] = useState('');
  const [date, setDate] = useState('');
  const [useCoins, setUseCoins] = useState(false);
  const [coins, setCoins] = useState('');

  function onSubmit() {
    createGoal({
      date: date,
      days: Number(days),
      description,
      useCoins,
      coins: Number(coins),
    });
  }

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: colors['pink-500'],
        width: 50,
      }}
      ref={bottomSheetRef}
      snapPoints={[400]}
      enablePanDownToClose
      onClose={onGoalClose}
    >
      <BottomSheetView className="flex-1 items-stretch py-4" style={{ paddingHorizontal: config.screenPadding }}>
        <Text className="text-2xl text-gray-700">Create Goal</Text>
        <View className="pt-5" />
        <Input
          label="Description"
          placeholder="Enter a goal description"
          value={description}
          onChangeText={setDescription}
        />
        <View className="flex-row gap-5 pt-5">
          <Input
            containerStyle={{ flex: 1 }}
            keyboardType="numeric"
            label="Days"
            maxLength={3}
            value={days}
            allowOnlyNumbers
            onChangeText={setDays}
          />
          <DateInput
            containerStyle={{ flex: 2 }}
            keyboardType="numeric"
            label="Start date"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View className="flex-row items-center gap-5 pt-5">
          <Checkbox
            containerStyle={{ flex: 3 }}
            label="Use coins to complete a the day"
            value={useCoins}
            onValueChange={setUseCoins}
          />
          <Input
            containerStyle={{ flex: 1 }}
            keyboardType="numeric"
            label="Coins"
            maxLength={2}
            value={coins}
            allowOnlyNumbers
            onChangeText={setCoins}
          />
        </View>
        <View className="pt-5" />
        <Button onPress={onSubmit}>Create</Button>
      </BottomSheetView>
    </BottomSheet>
  );
}
