import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { newDayTypeAssignment } from './DayTypeAssignment';

// Mock the dates module
vi.mock('../utils/dates', () => ({
  getCurrentDate: vi.fn(() => ({
    toString: () => '2024-06-15',
  })),
}));

describe('newDayTypeAssignment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('default values', () => {
    it('returns object with isAvailable set to true', () => {
      const result = newDayTypeAssignment();
      expect(result.isAvailable).toBe(true);
    });

    it('returns object with operatingPeriod.fromDate as current date string', () => {
      const result = newDayTypeAssignment();
      expect(result.operatingPeriod.fromDate).toBe('2024-06-15');
    });

    it('returns object with operatingPeriod.toDate as current date string', () => {
      const result = newDayTypeAssignment();
      expect(result.operatingPeriod.toDate).toBe('2024-06-15');
    });

    it('returns fromDate and toDate with the same value', () => {
      const result = newDayTypeAssignment();
      expect(result.operatingPeriod.fromDate).toBe(
        result.operatingPeriod.toDate,
      );
    });
  });

  describe('object creation', () => {
    it('returns a new object on each call', () => {
      const result1 = newDayTypeAssignment();
      const result2 = newDayTypeAssignment();
      expect(result1).not.toBe(result2);
    });

    it('returns a new operatingPeriod object on each call', () => {
      const result1 = newDayTypeAssignment();
      const result2 = newDayTypeAssignment();
      expect(result1.operatingPeriod).not.toBe(result2.operatingPeriod);
    });

    it('does not include id property', () => {
      const result = newDayTypeAssignment();
      expect(result).not.toHaveProperty('id');
    });

    it('does not include date property', () => {
      const result = newDayTypeAssignment();
      expect(result).not.toHaveProperty('date');
    });
  });
});
