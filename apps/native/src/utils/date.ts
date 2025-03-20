import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const date = Object.freeze({
  getWeekDay(date: Date) {
    return format(date, 'EEEE', { locale: ptBR });
  },
  getDayMonth(date: Date) {
    return format(date, 'dd/MM');
  },
  getDayMonthYear(date: Date) {
    return format(date, 'dd/MM/yyyy');
  },
  toDate(date: string) {
    return parseISO(date);
  },
});
