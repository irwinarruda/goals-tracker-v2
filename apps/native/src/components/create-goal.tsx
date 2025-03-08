import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { DateInput, Input } from 'goals-react/native';
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
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  function onSheetChanges(index: number) {
    console.log('handleSheetChanges', index);
  }

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: colors['blue-500'],
        width: 50,
      }}
      ref={bottomSheetRef}
      snapPoints={['90%']}
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
        <CheckBox disabled={false} value={toggleCheckBox} onValueChange={newValue => setToggleCheckBox(newValue)} />
      </BottomSheetView>
    </BottomSheet>
  );
}
