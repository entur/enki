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
  } catch {
    // Silently return null for invalid date strings - this is expected
    // behavior during date field editing (e.g., "202-01-13" while typing)
    return null;
  }
}

export function parseISOToCalendarDateTime(
  isoString: string | null | undefined,
): CalendarDateTime | null {
  if (!isoString) return null;
  try {
    return parseDateTime(isoString);
  } catch {
    // Silently return null for invalid datetime strings - this is expected
    // behavior during datetime field editing
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

/**
 * Check if CalendarDate has a valid 4-digit year (1000-9999)
 * Used to determine when to sync local date state back to parent ISO string state
 */
export function hasValidYear(date: CalendarDate | null): boolean {
  if (!date) return false;
  return date.year >= 1000 && date.year <= 9999;
}

/**
 * Validate that toDate is not before fromDate
 * Returns true if valid (toDate >= fromDate) or if either date cannot be parsed
 */
export function isNotBefore(
  toDate: string | null | undefined,
  fromDate: string | null | undefined,
): boolean {
  const to = parseISOToCalendarDate(toDate);
  const from = parseISOToCalendarDate(fromDate);
  // If either date can't be parsed, skip validation (return true = no error)
  if (!to || !from) {
    return true;
  }
  return to.compare(from) >= 0;
}

/**
 * Safely parse ISO string to CalendarDate with fallback
 * @param isoString - ISO date string to parse
 * @param fallback - Optional fallback CalendarDate (defaults to current date)
 */
export function safeParseDateWithFallback(
  isoString: string | null | undefined,
  fallback?: CalendarDate,
): CalendarDate {
  const parsed = parseISOToCalendarDate(isoString);
  return parsed ?? fallback ?? getCurrentDate();
}

export type { CalendarDate, CalendarDateTime } from '@internationalized/date';
