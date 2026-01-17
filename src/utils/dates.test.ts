import { CalendarDate, CalendarDateTime } from '@internationalized/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  calendarDateTimeToISO,
  calendarDateToISO,
  getCurrentDate,
  getCurrentDateTime,
  parseISOToCalendarDate,
  parseISOToCalendarDateTime,
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
});
