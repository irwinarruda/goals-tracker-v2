/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Image, ImageProps } from 'expo-image';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors, roundeds } from '../tokens';

export interface FABProps extends RectButtonProps {
  source: ImageProps['source'];
  size?: number;
}

export function FAB({ source, size = 64, onPress }: FABProps) {
  return (
    <RectButton style={[styles.button, { width: size, height: size }, styles.default_position]} onPress={onPress}>
      <Image source={source} style={{ width: size - 16, height: size - 16 }} />
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors['pink-500'],
    borderRadius: roundeds['full'],
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  default_position: {
    bottom: 64,
    position: 'absolute',
    right: 16,
  },
});
