import { colors, fontSizes, roundeds } from 'goals-react/tokens';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

export type GoalCardProps = RectButtonProps & {};

export function GoalCard(props: GoalCardProps) {
  return (
    <RectButton {...props} style={[styles.card, props.style]}>
      <View style={styles.title_container}>
        <Text style={styles.title_text}>Manter calorias diárias abaixo de 200</Text>
      </View>
      <View style={styles.info_container}>
        <View style={styles.info_item}>
          <Text style={styles.info_title}>Duration</Text>
          <Text style={styles.info_value}>30 days</Text>
        </View>
        <View style={styles.info_item}>
          <Text style={styles.info_title}>Start date</Text>
          <Text style={styles.info_value}>30/10/2023</Text>
        </View>
        <View style={styles.info_item}>
          <Text style={styles.info_title}>Coins</Text>
          <Text style={styles.info_value}>20</Text>
        </View>
      </View>
    </RectButton>
  );
}

GoalCard.height = 82;

const styles = StyleSheet.create({
  card: {
    alignItems: 'stretch',
    borderColor: colors['gray-300'],
    borderRadius: roundeds['md'],
    borderWidth: 1,
    justifyContent: 'center',
  },
  info_container: {
    flexDirection: 'row',
    gap: 36,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  info_item: {
    alignItems: 'flex-start',
  },
  info_title: {
    color: colors['gray-500'],
    fontSize: fontSizes['xs'],
  },
  info_value: {
    color: colors['black'],
    fontSize: fontSizes['xl'],
  },
  title_container: {
    backgroundColor: colors['blue-300'],
    borderRadius: roundeds['md'],
    marginHorizontal: -1,
    marginTop: -1,
    paddingHorizontal: 13,
    paddingVertical: 4,
    zIndex: -1,
  },
  title_text: {
    color: colors['white'],
    fontSize: fontSizes['md'],
    fontWeight: 'regular',
  },
});
