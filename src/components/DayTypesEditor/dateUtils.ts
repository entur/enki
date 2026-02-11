import { parseISO, format, isValid } from 'date-fns';

/**
 * Convert ISO date string to native Date, with fallback to today.
 */
export const parseToNativeDate = (
  isoString: string | null | undefined,
): Date => {
  if (!isoString) return new Date();
  const parsed = parseISO(isoString);
  return isValid(parsed) ? parsed : new Date();
};

/**
 * Convert native Date to ISO date string (YYYY-MM-DD).
 */
export const toISODateString = (date: Date | null): string | null => {
  if (!date || !isValid(date)) return null;
  return format(date, 'yyyy-MM-dd');
};
