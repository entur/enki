import moment from 'moment';

export const dateToString = (date: Date | null): string =>
  moment(date ?? undefined).format('YYYY-MM-DD');
