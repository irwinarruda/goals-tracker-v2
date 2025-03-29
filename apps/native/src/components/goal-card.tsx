import { date, Goal } from 'goals-tracker/logic';
import { colors, fontSizes, roundeds } from 'goals-tracker/tokens';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

export type GoalCardProps = RectButtonProps & {
  goal: Goal;
  selected?: boolean;
  accessibilityHint?: string | undefined;
  onLongPress?: () => void;
};

export function GoalCard(props: GoalCardProps) {
  const { goal, selected, accessibilityHint, onLongPress, ...rest } = props;
  return (
    <RectButton {...rest} style={[styles.card, props.style]} onLongPress={onLongPress}>
      <View accessibilityHint={accessibilityHint} accessibilityRole="button" style={styles.card_view} accessible>
        <View style={[styles.title_container, selected && styles.title_container_selected]}>
          <Text style={[styles.title_text, selected && styles.title_text_selected]}>{goal.description}</Text>
        </View>
        <View style={styles.info_container}>
          <View style={styles.info_item}>
            <Text style={styles.info_title}>Duration</Text>
            <Text style={styles.info_value}>{goal.days.length}</Text>
          </View>
          <View style={styles.info_item}>
            <Text style={styles.info_title}>Start date</Text>
            <Text style={styles.info_value}>{date.getDayMonthYear(date.toDate(goal.days[0].date))}</Text>
          </View>
          <View style={styles.info_item}>
            <Text style={styles.info_title}>Coins</Text>
            <Text style={styles.info_value}>{goal.coins}</Text>
          </View>
        </View>
      </View>
    </RectButton>
  );
}

GoalCard.height = 82;

const styles = StyleSheet.create({
  card: {
    borderColor: colors['gray-300'],
    borderRadius: roundeds['md'],
    borderWidth: 1,
  },
  card_view: {
    alignItems: 'stretch',
    justifyContent: 'center',
    zIndex: -1,
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
  },
  title_container_selected: {
    backgroundColor: colors['pink-500'],
  },
  title_text: {
    color: colors['white'],
    fontSize: fontSizes['md'],
    fontWeight: 'regular',
  },
  title_text_selected: {
    fontWeight: 'bold',
  },
});
