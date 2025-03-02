import { StatusBar } from 'expo-status-bar';
import { Button } from 'goals-tokens';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function Native() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Native</Text>
      <Button
        text="Boop"
        onClick={() => {
          Alert.alert('Pressed!');
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
