import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  now,
  parseDate,
  parseDateTime,
  toCalendarDate,
  toCalendarDateTime,
  today,
} from '@internationalized/date';

export function parseISOToCalendarDate(
  isoString: string | null | undefined,
): CalendarDate | null {
  if (!isoString) return null;
  try {
    return parseDate(isoString);
  } catch (e) {
    console.error('Failed to parse ISO string to CalendarDate:', e);
    return null;
  }
}

export function parseISOToCalendarDateTime(
  isoString: string | null | undefined,
): CalendarDateTime | null {
  if (!isoString) return null;
  try {
    return parseDateTime(isoString);
  } catch (e) {
    console.error('Failed to parse ISO string to CalendarDateTime:', e);
    return null;
  }
}

export function calendarDateToISO(
  date: CalendarDate | null | undefined,
): string | null {
  if (!date) return null;
  return date.toString();
}

export function calendarDateTimeToISO(
  dateTime: CalendarDateTime | null | undefined,
): string | null {
  if (!dateTime) return null;
  return dateTime.toString();
}

export function getCurrentDate(): CalendarDate {
  return toCalendarDate(today(getLocalTimeZone()));
}

export function getCurrentDateTime(): CalendarDateTime {
  return toCalendarDateTime(now(getLocalTimeZone()));
}

export type { CalendarDate, CalendarDateTime } from '@internationalized/date';
