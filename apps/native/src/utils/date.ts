export const date = Object.freeze({
  addDays(date: Date, numDays?: number) {
    if (!numDays) return date;
    return new Date(date.getTime() + numDays * 24 * 60 * 60 * 1000);
  },
  getWeekDay(date: Date) {
    const ptDayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return ptDayNames[date.getDay() - 1];
  },
  getDayAndMonth(date: Date) {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  },
});
