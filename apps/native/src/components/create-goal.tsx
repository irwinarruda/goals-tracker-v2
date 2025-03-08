import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Checkbox, DateInput, Input } from 'goals-react/native';
import { colors } from 'goals-react/tokens';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

export function CreateGoal() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [daysValue, setDaysValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [useCoins, setUseCoins] = useState(false);
  const [coins, setCoins] = useState('');

  function onSheetChanges(index: number) {
    console.log('handleSheetChanges', index);
  }

  function onSubmit() {}

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
      onChange={onSheetChanges}
    >
      <BottomSheetView className="flex-1 items-stretch p-4">
        <Text className="text-2xl text-gray-700">Create Goal</Text>
        <View className="pt-5" />
        <Input label="Description" placeholder="Enter a goal description" />
        <View className="flex-row gap-5 pt-5">
          <Input
            containerStyle={{ flex: 1 }}
            keyboardType="numeric"
            label="Days"
            maxLength={3}
            value={daysValue}
            allowOnlyNumbers
            onChangeText={setDaysValue}
          />
          <DateInput
            containerStyle={{ flex: 2 }}
            keyboardType="numeric"
            label="Start date"
            value={dateValue}
            onChangeText={setDateValue}
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
