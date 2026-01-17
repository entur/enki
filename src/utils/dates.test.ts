import { CalendarDate, CalendarDateTime } from '@internationalized/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  calendarDateTimeToISO,
  calendarDateToISO,
  getCurrentDate,
  getCurrentDateTime,
  hasValidYear,
  isNotBefore,
  parseISOToCalendarDate,
  parseISOToCalendarDateTime,
  safeParseDateWithFallback,
} from './dates';

describe('dates', () => {
  describe('parseISOToCalendarDate', () => {
    it('should parse a valid ISO date string', () => {
      const result = parseISOToCalendarDate('2024-01-15');
      expect(result).not.toBeNull();
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(15);
    });

    it('should parse a leap year date', () => {
      const result = parseISOToCalendarDate('2024-02-29');
      expect(result).not.toBeNull();
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(2);
      expect(result?.day).toBe(29);
    });

    it('should parse first day of year', () => {
      const result = parseISOToCalendarDate('2024-01-01');
      expect(result).not.toBeNull();
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(1);
    });

    it('should parse last day of year', () => {
      const result = parseISOToCalendarDate('2024-12-31');
      expect(result).not.toBeNull();
      expect(result?.month).toBe(12);
      expect(result?.day).toBe(31);
    });

    it('should return null for null input', () => {
      expect(parseISOToCalendarDate(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(parseISOToCalendarDate(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseISOToCalendarDate('')).toBeNull();
    });

    it('should return null for invalid date format', () => {
      expect(parseISOToCalendarDate('not-a-date')).toBeNull();
    });

    it('should return null for partial date while typing', () => {
      expect(parseISOToCalendarDate('202-01-13')).toBeNull();
    });

    it('should return null for invalid month', () => {
      expect(parseISOToCalendarDate('2024-13-01')).toBeNull();
    });

    it('should return null for invalid day', () => {
      expect(parseISOToCalendarDate('2024-01-32')).toBeNull();
    });

    it('should return null for invalid leap year date', () => {
      expect(parseISOToCalendarDate('2023-02-29')).toBeNull();
    });
  });

  describe('parseISOToCalendarDateTime', () => {
    it('should parse a valid ISO datetime string', () => {
      const result = parseISOToCalendarDateTime('2024-01-15T10:30:00');
      expect(result).not.toBeNull();
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(15);
      expect(result?.hour).toBe(10);
      expect(result?.minute).toBe(30);
      expect(result?.second).toBe(0);
    });

    it('should parse datetime with seconds', () => {
      const result = parseISOToCalendarDateTime('2024-01-15T10:30:45');
      expect(result).not.toBeNull();
      expect(result?.second).toBe(45);
    });

    it('should parse midnight', () => {
      const result = parseISOToCalendarDateTime('2024-01-15T00:00:00');
      expect(result).not.toBeNull();
      expect(result?.hour).toBe(0);
      expect(result?.minute).toBe(0);
    });

    it('should parse end of day', () => {
      const result = parseISOToCalendarDateTime('2024-01-15T23:59:59');
      expect(result).not.toBeNull();
      expect(result?.hour).toBe(23);
      expect(result?.minute).toBe(59);
      expect(result?.second).toBe(59);
    });

    it('should return null for null input', () => {
      expect(parseISOToCalendarDateTime(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(parseISOToCalendarDateTime(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseISOToCalendarDateTime('')).toBeNull();
    });

    it('should return null for invalid datetime format', () => {
      expect(parseISOToCalendarDateTime('not-a-datetime')).toBeNull();
    });

    it('should parse date without time as midnight', () => {
      // The underlying parseDateTime from @internationalized/date accepts date-only strings
      const result = parseISOToCalendarDateTime('2024-01-15');
      expect(result).not.toBeNull();
      expect(result?.hour).toBe(0);
      expect(result?.minute).toBe(0);
      expect(result?.second).toBe(0);
    });

    it('should return null for invalid hour', () => {
      expect(parseISOToCalendarDateTime('2024-01-15T25:00:00')).toBeNull();
    });

    it('should return null for invalid minute', () => {
      expect(parseISOToCalendarDateTime('2024-01-15T10:60:00')).toBeNull();
    });
  });

  describe('calendarDateToISO', () => {
    it('should convert a CalendarDate to ISO string', () => {
      const date = new CalendarDate(2024, 1, 15);
      expect(calendarDateToISO(date)).toBe('2024-01-15');
    });

    it('should pad single digit month and day', () => {
      const date = new CalendarDate(2024, 5, 3);
      expect(calendarDateToISO(date)).toBe('2024-05-03');
    });

    it('should handle leap year date', () => {
      const date = new CalendarDate(2024, 2, 29);
      expect(calendarDateToISO(date)).toBe('2024-02-29');
    });

    it('should return null for null input', () => {
      expect(calendarDateToISO(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(calendarDateToISO(undefined)).toBeNull();
    });
  });

  describe('calendarDateTimeToISO', () => {
    it('should convert a CalendarDateTime to ISO string', () => {
      const dateTime = new CalendarDateTime(2024, 1, 15, 10, 30, 0);
      expect(calendarDateTimeToISO(dateTime)).toBe('2024-01-15T10:30:00');
    });

    it('should pad single digit values', () => {
      const dateTime = new CalendarDateTime(2024, 5, 3, 9, 5, 2);
      expect(calendarDateTimeToISO(dateTime)).toBe('2024-05-03T09:05:02');
    });

    it('should handle midnight', () => {
      const dateTime = new CalendarDateTime(2024, 1, 15, 0, 0, 0);
      expect(calendarDateTimeToISO(dateTime)).toBe('2024-01-15T00:00:00');
    });

    it('should return null for null input', () => {
      expect(calendarDateTimeToISO(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(calendarDateTimeToISO(undefined)).toBeNull();
    });
  });

  describe('getCurrentDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return current date as CalendarDate', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      const result = getCurrentDate();
      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('should return correct date at year boundary', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00'));
      const result = getCurrentDate();
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('should return correct date at year end', () => {
      vi.setSystemTime(new Date('2024-12-31T23:59:59'));
      const result = getCurrentDate();
      expect(result.year).toBe(2024);
      expect(result.month).toBe(12);
      expect(result.day).toBe(31);
    });
  });

  describe('getCurrentDateTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return current datetime as CalendarDateTime', () => {
      vi.setSystemTime(new Date('2024-06-15T14:30:45'));
      const result = getCurrentDateTime();
      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it('should return correct datetime at midnight', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00'));
      const result = getCurrentDateTime();
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it('should return correct datetime at end of day', () => {
      vi.setSystemTime(new Date('2024-12-31T23:59:59'));
      const result = getCurrentDateTime();
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(59);
    });
  });

  describe('hasValidYear', () => {
    it('should return true for valid 4-digit year', () => {
      const date = new CalendarDate(2024, 6, 15);
      expect(hasValidYear(date)).toBe(true);
    });

    it('should return true for minimum valid year (1000)', () => {
      const date = new CalendarDate(1000, 1, 1);
      expect(hasValidYear(date)).toBe(true);
    });

    it('should return true for maximum valid year (9999)', () => {
      const date = new CalendarDate(9999, 12, 31);
      expect(hasValidYear(date)).toBe(true);
    });

    it('should return false for null', () => {
      expect(hasValidYear(null)).toBe(false);
    });

    it('should return false for 3-digit year', () => {
      const date = new CalendarDate(999, 1, 1);
      expect(hasValidYear(date)).toBe(false);
    });

    // Note: CalendarDate library clamps years above 9999 to 9999,
    // so we can't test 5-digit years - they become valid 4-digit years
  });

  describe('isNotBefore', () => {
    it('should return true when toDate equals fromDate', () => {
      expect(isNotBefore('2024-06-15', '2024-06-15')).toBe(true);
    });

    it('should return true when toDate is after fromDate', () => {
      expect(isNotBefore('2024-06-20', '2024-06-15')).toBe(true);
    });

    it('should return false when toDate is before fromDate', () => {
      expect(isNotBefore('2024-06-10', '2024-06-15')).toBe(false);
    });

    it('should return true for null toDate (skip validation)', () => {
      expect(isNotBefore(null, '2024-06-15')).toBe(true);
    });

    it('should return true for null fromDate (skip validation)', () => {
      expect(isNotBefore('2024-06-15', null)).toBe(true);
    });

    it('should return true for undefined dates (skip validation)', () => {
      expect(isNotBefore(undefined, undefined)).toBe(true);
    });

    it('should return true for invalid date strings (skip validation)', () => {
      expect(isNotBefore('invalid', '2024-06-15')).toBe(true);
    });

    it('should handle cross-year comparison', () => {
      expect(isNotBefore('2025-01-01', '2024-12-31')).toBe(true);
      expect(isNotBefore('2024-12-31', '2025-01-01')).toBe(false);
    });
  });

  describe('safeParseDateWithFallback', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should parse valid ISO date string', () => {
      const result = safeParseDateWithFallback('2024-03-20');
      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
      expect(result.day).toBe(20);
    });

    it('should return current date for null input', () => {
      const result = safeParseDateWithFallback(null);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('should return current date for undefined input', () => {
      const result = safeParseDateWithFallback(undefined);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('should return current date for invalid date string', () => {
      const result = safeParseDateWithFallback('invalid');
      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('should return provided fallback when parsing fails', () => {
      const fallback = new CalendarDate(2000, 1, 1);
      const result = safeParseDateWithFallback(null, fallback);
      expect(result.year).toBe(2000);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('should return provided fallback for invalid date', () => {
      const fallback = new CalendarDate(2000, 1, 1);
      const result = safeParseDateWithFallback('invalid', fallback);
      expect(result.year).toBe(2000);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });
  });
});
