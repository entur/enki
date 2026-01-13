import {
  fromDate,
  getLocalTimeZone,
  toCalendarDate,
} from '@internationalized/date';

const dateString = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const dateToString = (date: Date | null): string =>
  date ? dateString(date) : dateString(new Date());
