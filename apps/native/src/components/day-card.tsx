import { colors, fontSizes, roundeds } from 'goals-react/tokens';
import * as React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { date } from '~/app/utils/date';

export type DayStatus = 'success' | 'error' | 'pending' | 'pending_today';

export type DayCardProps = RectButtonProps & {
  status: DayStatus;
  isBought?: boolean;
  count: number;
  day: Date;
};

const cardMargin = 6;
const activeScreenSize = Dimensions.get('window').width - 2 * 16 - 4 * cardMargin;
const cardSize = activeScreenSize / 5;
export function DayCard({ status, isBought, count, day, onPress }: DayCardProps) {
  return (
    <RectButton
      style={[
        styles.card,
        { width: cardSize, height: cardSize },
        status === 'success' && styles.card_success,
        status === 'error' && styles.card_error,
        status === 'pending' && styles.card_pending,
        status === 'pending_today' && styles.card_pending_today,
        isBought && styles.is_bought,
      ]}
      onPress={onPress}
    >
      <Text style={styles.day_count}>{count}</Text>
      <Text style={styles.day_text}>{date.getWeekDay(day)}</Text>
      <Text style={styles.day_number}>{date.getDayMonth(day)}</Text>
    </RectButton>
  );
}

DayCard.cardSize = cardSize;
DayCard.cardMargin = cardMargin;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: roundeds['lg'],
    fontSize: fontSizes['md'],
    justifyContent: 'center',
    textAlign: 'center',
  },
  card_error: {
    backgroundColor: colors['pink-700'],
  },
  card_pending: {
    backgroundColor: colors['gray-500'],
  },
  card_pending_today: {
    backgroundColor: colors['gray-500'],
    borderColor: colors['blue-300'],
    borderWidth: 4,
  },
  card_success: {
    backgroundColor: colors['green-500'],
  },
  day_count: {
    color: 'white',
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
  },
  day_number: {
    color: 'white',
    fontSize: fontSizes['3xs'],
    fontWeight: 'semibold',
  },
  day_text: {
    color: 'white',
    fontSize: fontSizes['2xs'],
    fontWeight: 'semibold',
  },
  is_bought: {
    borderColor: colors['yellow-500'],
    borderWidth: 4,
  },
});
