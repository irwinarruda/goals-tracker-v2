/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Image, ImageProps } from 'expo-image';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors } from '../tokens';

export type FABProps = RectButtonProps & {
  source: ImageProps['source'];
  size?: number;
};

export function FAB({ source, size = 64, onPress }: FABProps) {
  return (
    <RectButton style={[styles.button, { width: size, height: size }, styles.defaultPosition]} onPress={onPress}>
      <Image source={source} style={{ width: size - 8, height: size - 8 }} />
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors['pink-500'],
    borderRadius: 1000,
    flexDirection: 'row',
    fontSize: 15,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  defaultPosition: {
    bottom: 64,
    position: 'absolute',
    right: 16,
  },
});
