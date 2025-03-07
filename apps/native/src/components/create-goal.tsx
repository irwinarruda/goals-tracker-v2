import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { Input } from 'goals-react/native';
import { colors } from 'goals-react/tokens';
import { useCallback, useEffect, useRef } from 'react';

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}

export function CreateGoal() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const onSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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
        <Input label="Hello World" />
      </BottomSheetView>
    </BottomSheet>
  );
}
