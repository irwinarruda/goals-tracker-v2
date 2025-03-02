import * as React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

export interface ButtonProps {
  text: string;
  onClick?: (event: GestureResponderEvent) => void;
}

export function Button({ text, onClick }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onClick}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2f80ed',
    borderRadius: 10,
    fontSize: 15,
    maxWidth: 200,
    paddingBottom: 14,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 14,
    textAlign: 'center',
  },
  text: {
    color: 'white',
  },
});
