import { addDays, format, isBefore, isToday, isTomorrow, isYesterday, parseISO, startOfDay, subDays } from 'date-fns';

export const date = {
  isToday,
  isBefore,
  isTomorrow,
  isYesterday,
  startOfDay,
  parseISO,
  format,
  addDays,
  subDays,
  normalizeTZ(date: Date) {
    const dtDateOnly = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
    return dtDateOnly;
  },
  getWeekDay(date: Date) {
    const ptDayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return ptDayNames[date.getDay()];
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
  formatISO(date: Date) {
    return format(date, 'yyyy-MM-dd');
  },
};
