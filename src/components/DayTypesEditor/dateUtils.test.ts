import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseToNativeDate, toISODateString } from './dateUtils';

describe('parseToNativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('parses a valid ISO date string', () => {
    const result = parseToNativeDate('2025-03-20');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2); // March = 2
    expect(result.getDate()).toBe(20);
  });

  it('returns today for null input', () => {
    const result = parseToNativeDate(null);
    expect(result.toISOString()).toContain('2025-06-15');
  });

  it('returns today for undefined input', () => {
    const result = parseToNativeDate(undefined);
    expect(result.toISOString()).toContain('2025-06-15');
  });

  it('returns today for empty string', () => {
    const result = parseToNativeDate('');
    expect(result.toISOString()).toContain('2025-06-15');
  });

  it('returns today for an invalid date string', () => {
    const result = parseToNativeDate('not-a-date');
    expect(result.toISOString()).toContain('2025-06-15');
  });

  it('parses a full ISO datetime string', () => {
    const result = parseToNativeDate('2024-12-25T10:30:00Z');
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(11); // December = 11
    expect(result.getDate()).toBe(25);
  });
});

describe('toISODateString', () => {
  it('formats a valid Date to YYYY-MM-DD', () => {
    const date = new Date('2025-03-20T00:00:00');
    expect(toISODateString(date)).toBe('2025-03-20');
  });

  it('returns null for null input', () => {
    expect(toISODateString(null)).toBeNull();
  });

  it('returns null for an invalid Date object', () => {
    expect(toISODateString(new Date('invalid'))).toBeNull();
  });

  it('formats a date with single-digit month and day', () => {
    const date = new Date('2025-01-05T00:00:00');
    expect(toISODateString(date)).toBe('2025-01-05');
  });

  it('formats the last day of the year', () => {
    const date = new Date('2025-12-31T00:00:00');
    expect(toISODateString(date)).toBe('2025-12-31');
  });
});
