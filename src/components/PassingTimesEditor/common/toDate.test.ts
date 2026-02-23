import { describe, it, expect } from 'vitest';
import { toDate } from './toDate';

describe('toDate', () => {
  it('returns a Date with current date when input is undefined', () => {
    const result = toDate(undefined);
    expect(result).toBeInstanceOf(Date);
  });

  it('returns a Date with current date when input is empty string', () => {
    const result = toDate('');
    expect(result).toBeInstanceOf(Date);
  });

  it('parses hours, minutes and seconds from time string', () => {
    const result = toDate('14:30:45');
    expect(result).toBeInstanceOf(Date);
    expect(result!.getHours()).toBe(14);
    expect(result!.getMinutes()).toBe(30);
    expect(result!.getSeconds()).toBe(45);
  });

  it('parses midnight correctly', () => {
    const result = toDate('00:00:00');
    expect(result!.getHours()).toBe(0);
    expect(result!.getMinutes()).toBe(0);
    expect(result!.getSeconds()).toBe(0);
  });

  it('parses single-digit values', () => {
    const result = toDate('9:5:3');
    expect(result!.getHours()).toBe(9);
    expect(result!.getMinutes()).toBe(5);
    expect(result!.getSeconds()).toBe(3);
  });
});
