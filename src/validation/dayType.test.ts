import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetIdCounters,
  createDate,
  createDayType,
  createWeekendDayType,
  createSingleDayType,
  createExpiredDayType,
  createFutureDayType,
  createDayTypeAssignment,
  createOperatingPeriod,
} from 'test/factories';
import { DAY_OF_WEEK } from 'model/enums';
import { validateDayType, validateDayTypes } from './dayType';

describe('day type validation', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('validateDayType', () => {
    it('returns true when operating period contains matching day of week', () => {
      const dayType = createDayType(); // Weekdays (Mon-Fri) with 30-day period
      expect(validateDayType(dayType)).toBe(true);
    });

    it('returns true for weekend day type with weekend in period', () => {
      const dayType = createWeekendDayType(); // Sat-Sun with 30-day period
      expect(validateDayType(dayType)).toBe(true);
    });

    it('returns true for future day type', () => {
      const dayType = createFutureDayType();
      expect(validateDayType(dayType)).toBe(true);
    });

    it('returns true for expired day type (valid structure, past dates)', () => {
      const dayType = createExpiredDayType();
      expect(validateDayType(dayType)).toBe(true);
    });

    it('returns false when dates cannot be parsed', () => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: {
              fromDate: 'invalid-date',
              toDate: '2024-12-31',
            },
          }),
        ],
      });
      expect(validateDayType(dayType)).toBe(false);
    });

    it('returns false when fromDate is invalid', () => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: {
              fromDate: '',
              toDate: createDate(30),
            },
          }),
        ],
      });
      expect(validateDayType(dayType)).toBe(false);
    });

    it('returns false when toDate is invalid', () => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: {
              fromDate: createDate(0),
              toDate: '',
            },
          }),
        ],
      });
      expect(validateDayType(dayType)).toBe(false);
    });

    it('returns true when multiple assignments all have matching days', () => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment(),
          createDayTypeAssignment({
            operatingPeriod: createOperatingPeriod({
              fromDate: createDate(60),
              toDate: createDate(90),
            }),
          }),
        ],
      });
      expect(validateDayType(dayType)).toBe(true);
    });

    it('handles empty daysOfWeek array', () => {
      const dayType = createDayType({
        daysOfWeek: [],
      });
      // With empty daysOfWeek, no day in the period will match
      expect(validateDayType(dayType)).toBe(false);
    });

    it('returns false when operating period has no matching days for single-day type', () => {
      // Create a specific date range that doesn't include a specific day of week
      // We'll use a 6-day range that explicitly excludes the target day
      // Find today's day of week (0=Sunday, 1=Monday, etc.)
      const today = new Date();
      const todayDayOfWeek = today.getDay();

      // Choose a day that is NOT within the next 6 days from today
      // If today is Monday (1), days within next 6 days are Tue-Sun (2-0)
      // So Monday would not be included if we only span 6 days starting tomorrow
      const daysOfWeekMap: Record<number, DAY_OF_WEEK> = {
        0: DAY_OF_WEEK.SUNDAY,
        1: DAY_OF_WEEK.MONDAY,
        2: DAY_OF_WEEK.TUESDAY,
        3: DAY_OF_WEEK.WEDNESDAY,
        4: DAY_OF_WEEK.THURSDAY,
        5: DAY_OF_WEEK.FRIDAY,
        6: DAY_OF_WEEK.SATURDAY,
      };

      // Pick a day that won't appear in a 6-day window starting tomorrow
      // Tomorrow + 6 days = 7 days total, which covers all days
      // So we need a shorter window. Let's use a 5-day window starting 2 days from now
      // That way one day is guaranteed to be excluded
      const excludedDayIndex = (todayDayOfWeek + 7) % 7; // Same as today
      const excludedDay = daysOfWeekMap[excludedDayIndex];

      const dayType = createSingleDayType(excludedDay, {
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: {
              // Start 1 day from now and end 6 days from now (6 consecutive days)
              // This excludes today's day of the week
              fromDate: createDate(1),
              toDate: createDate(6),
            },
          }),
        ],
      });

      expect(validateDayType(dayType)).toBe(false);
    });

    it('validates each assignment independently', () => {
      // First assignment has matching days, second doesn't (invalid dates)
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment(), // Valid
          createDayTypeAssignment({
            operatingPeriod: {
              fromDate: 'invalid',
              toDate: 'invalid',
            },
          }), // Invalid
        ],
      });
      expect(validateDayType(dayType)).toBe(false);
    });

    it('returns true for single-day type when that day exists in period', () => {
      // Create a Monday-only day type with a period that spans at least 7 days
      const dayType = createSingleDayType(DAY_OF_WEEK.MONDAY, {
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: {
              fromDate: createDate(0),
              toDate: createDate(10), // 10 days ensures at least one Monday
            },
          }),
        ],
      });
      expect(validateDayType(dayType)).toBe(true);
    });
  });

  describe('validateDayTypes', () => {
    it('returns false when dayTypes is undefined', () => {
      expect(validateDayTypes(undefined)).toBe(false);
    });

    it('returns true when dayTypes is empty array (vacuous truth)', () => {
      // Note: empty array returns true because [].every() returns true
      // The parent validateServiceJourney function has additional checks
      // for ensuring at least one dayType exists with daysOfWeek
      expect(validateDayTypes([])).toBe(true);
    });

    it('returns true when all day types are valid', () => {
      const dayTypes = [createDayType(), createWeekendDayType()];
      expect(validateDayTypes(dayTypes)).toBe(true);
    });

    it('returns false when any day type is invalid', () => {
      const dayTypes = [
        createDayType(),
        createDayType({
          dayTypeAssignments: [
            createDayTypeAssignment({
              operatingPeriod: {
                fromDate: 'invalid',
                toDate: 'invalid',
              },
            }),
          ],
        }),
      ];
      expect(validateDayTypes(dayTypes)).toBe(false);
    });

    it('returns true for single valid day type', () => {
      const dayTypes = [createDayType()];
      expect(validateDayTypes(dayTypes)).toBe(true);
    });

    it('returns false when one of multiple day types has empty daysOfWeek', () => {
      const dayTypes = [
        createDayType(),
        createDayType({ daysOfWeek: [] }), // No days selected
      ];
      expect(validateDayTypes(dayTypes)).toBe(false);
    });
  });
});
