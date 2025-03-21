import { format, parseISO } from 'date-fns';

export const date = Object.freeze({
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
});
