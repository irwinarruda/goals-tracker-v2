import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';

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
      ref={bottomSheetRef}
      snapPoints={['90%']}
      enablePanDownToClose
      onChange={onSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text>Test</Text>
      </BottomSheetView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    height: 600,
    padding: 50,
  },
});
