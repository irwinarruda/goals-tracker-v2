import { Image, ImageProps } from 'expo-image';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { colors, roundeds } from '../tokens';

export interface IconButtonProps extends RectButtonProps {
  icon?: React.ReactNode;
  source?: ImageProps['source'];
  size?: number;
  backgroundColor?: string;
}

export function IconButton({ source, size = 28, icon, backgroundColor, enabled, style, onPress }: IconButtonProps) {
  if (!source && !icon) throw new Error('Either source or icon must be provided');
  let Component: React.ReactNode;
  if (source) {
    Component = <Image source={source} style={{ width: size - 8, height: size - 8 }} />;
  } else {
    Component = icon;
  }
  return (
    <RectButton
      enabled={enabled}
      style={[
        styles.button,
        !!backgroundColor && { backgroundColor },
        { width: size, height: size },
        enabled === false && styles.button_disabled,
        style,
      ]}
      onPress={onPress}
    >
      <View accessible accessibilityRole="button">
        {Component}
      </View>
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
    maxWidth: 200,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  button_disabled: {
    opacity: 0.6,
  },
});
