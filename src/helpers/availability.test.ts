import { CalendarDate } from '@internationalized/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Availability,
  calculateLineAvailability,
  getJourneyPatternsAvailability,
  mapStatusToText,
  mergeAvailability,
  unionAvailability,
} from './availability';
import {
  createDayType,
  createDayTypeAssignment,
  createJourneyPattern,
  createOperatingPeriod,
  createServiceJourneyWithPassingTimes,
  resetIdCounters,
} from 'test/factories';

describe('availability', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('unionAvailability', () => {
    it('should return the widest range when left starts earlier', () => {
      const left: Availability = {
        from: new CalendarDate(2024, 1, 1),
        to: new CalendarDate(2024, 6, 30),
      };
      const right: Availability = {
        from: new CalendarDate(2024, 3, 1),
        to: new CalendarDate(2024, 12, 31),
      };

      const result = unionAvailability(left, right);

      expect(result.from.year).toBe(2024);
      expect(result.from.month).toBe(1);
      expect(result.from.day).toBe(1);
      expect(result.to.year).toBe(2024);
      expect(result.to.month).toBe(12);
      expect(result.to.day).toBe(31);
    });

    it('should return the widest range when right starts earlier', () => {
      const left: Availability = {
        from: new CalendarDate(2024, 6, 1),
        to: new CalendarDate(2024, 12, 31),
      };
      const right: Availability = {
        from: new CalendarDate(2024, 1, 1),
        to: new CalendarDate(2024, 6, 30),
      };

      const result = unionAvailability(left, right);

      expect(result.from.month).toBe(1);
      expect(result.to.month).toBe(12);
    });

    it('should handle identical ranges', () => {
      const range: Availability = {
        from: new CalendarDate(2024, 6, 1),
        to: new CalendarDate(2024, 6, 30),
      };

      const result = unionAvailability(range, range);

      expect(result.from.month).toBe(6);
      expect(result.from.day).toBe(1);
      expect(result.to.month).toBe(6);
      expect(result.to.day).toBe(30);
    });

    it('should handle non-overlapping ranges', () => {
      const left: Availability = {
        from: new CalendarDate(2024, 1, 1),
        to: new CalendarDate(2024, 3, 31),
      };
      const right: Availability = {
        from: new CalendarDate(2024, 10, 1),
        to: new CalendarDate(2024, 12, 31),
      };

      const result = unionAvailability(left, right);

      expect(result.from.month).toBe(1);
      expect(result.to.month).toBe(12);
    });
  });

  describe('mergeAvailability', () => {
    it('should create availability from operating period when none exists', () => {
      const operatingPeriod = createOperatingPeriod({
        fromDate: '2024-06-01',
        toDate: '2024-06-30',
      });

      const result = mergeAvailability(undefined, operatingPeriod);

      expect(result.from.year).toBe(2024);
      expect(result.from.month).toBe(6);
      expect(result.from.day).toBe(1);
      expect(result.to.day).toBe(30);
    });

    it('should merge with existing availability', () => {
      const existing: Availability = {
        from: new CalendarDate(2024, 6, 15),
        to: new CalendarDate(2024, 6, 30),
      };
      const operatingPeriod = createOperatingPeriod({
        fromDate: '2024-06-01',
        toDate: '2024-07-31',
      });

      const result = mergeAvailability(existing, operatingPeriod);

      expect(result.from.day).toBe(1);
      expect(result.to.month).toBe(7);
      expect(result.to.day).toBe(31);
    });

    it('should throw error for invalid fromDate', () => {
      const operatingPeriod = createOperatingPeriod({
        fromDate: 'invalid',
        toDate: '2024-06-30',
      });

      expect(() => mergeAvailability(undefined, operatingPeriod)).toThrow(
        'Invalid operating period dates',
      );
    });

    it('should throw error for invalid toDate', () => {
      const operatingPeriod = createOperatingPeriod({
        fromDate: '2024-06-01',
        toDate: 'invalid',
      });

      expect(() => mergeAvailability(undefined, operatingPeriod)).toThrow(
        'Invalid operating period dates',
      );
    });
  });

  describe('getJourneyPatternsAvailability', () => {
    it('should calculate availability from single journey pattern', () => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: createOperatingPeriod({
              fromDate: '2024-06-01',
              toDate: '2024-08-31',
            }),
          }),
        ],
      });
      const serviceJourney = createServiceJourneyWithPassingTimes(3);
      serviceJourney.dayTypes = [dayType];
      const journeyPattern = createJourneyPattern({
        serviceJourneys: [serviceJourney],
      });

      const result = getJourneyPatternsAvailability([journeyPattern]);

      expect(result.from.month).toBe(6);
      expect(result.to.month).toBe(8);
    });

    it('should merge availability from multiple journey patterns', () => {
      const dayType1 = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: createOperatingPeriod({
              fromDate: '2024-06-01',
              toDate: '2024-06-30',
            }),
          }),
        ],
      });
      const dayType2 = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: createOperatingPeriod({
              fromDate: '2024-08-01',
              toDate: '2024-12-31',
            }),
          }),
        ],
      });

      const sj1 = createServiceJourneyWithPassingTimes(3);
      sj1.dayTypes = [dayType1];
      const sj2 = createServiceJourneyWithPassingTimes(3);
      sj2.dayTypes = [dayType2];

      const jp1 = createJourneyPattern({ serviceJourneys: [sj1] });
      const jp2 = createJourneyPattern({ serviceJourneys: [sj2] });

      const result = getJourneyPatternsAvailability([jp1, jp2]);

      expect(result.from.month).toBe(6);
      expect(result.to.month).toBe(12);
    });

    it('should throw error when no journey patterns provided', () => {
      expect(() => getJourneyPatternsAvailability(undefined)).toThrow(
        'Unable to calculate availability for line',
      );
    });

    it('should throw error when journey patterns have no day type assignments', () => {
      const journeyPattern = createJourneyPattern({
        serviceJourneys: [
          {
            ...createServiceJourneyWithPassingTimes(3),
            dayTypes: [],
          },
        ],
      });

      expect(() => getJourneyPatternsAvailability([journeyPattern])).toThrow(
        'Unable to calculate availability for line',
      );
    });
  });

  describe('calculateLineAvailability', () => {
    const createJourneyPatternWithAvailability = (
      fromDate: string,
      toDate: string,
    ) => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({
            operatingPeriod: createOperatingPeriod({ fromDate, toDate }),
          }),
        ],
      });
      const serviceJourney = createServiceJourneyWithPassingTimes(3);
      serviceJourney.dayTypes = [dayType];
      return createJourneyPattern({ serviceJourneys: [serviceJourney] });
    };

    it('should return positive status when available > 121 days', () => {
      const referenceDate = new CalendarDate(2024, 6, 1);
      const journeyPattern = createJourneyPatternWithAvailability(
        '2024-06-01',
        '2024-12-31', // 213 days from reference
      );

      const result = calculateLineAvailability([journeyPattern], referenceDate);

      expect(result.status).toBe('positive');
      expect(result.daysUntilUnavailable).toBeGreaterThan(121);
    });

    it('should return neutral status when available 1-121 days', () => {
      const referenceDate = new CalendarDate(2024, 6, 1);
      const journeyPattern = createJourneyPatternWithAvailability(
        '2024-06-01',
        '2024-08-01', // 61 days from reference
      );

      const result = calculateLineAvailability([journeyPattern], referenceDate);

      expect(result.status).toBe('neutral');
      expect(result.daysUntilUnavailable).toBeGreaterThan(0);
      expect(result.daysUntilUnavailable).toBeLessThanOrEqual(121);
    });

    it('should return negative status when no longer available', () => {
      const referenceDate = new CalendarDate(2024, 6, 1);
      const journeyPattern = createJourneyPatternWithAvailability(
        '2024-01-01',
        '2024-05-31', // expired
      );

      const result = calculateLineAvailability([journeyPattern], referenceDate);

      expect(result.status).toBe('negative');
      expect(result.daysUntilUnavailable).toBeLessThanOrEqual(0);
    });

    it('should return negative status when available exactly 0 days', () => {
      const referenceDate = new CalendarDate(2024, 6, 1);
      const journeyPattern = createJourneyPatternWithAvailability(
        '2024-05-01',
        '2024-06-01', // ends today
      );

      const result = calculateLineAvailability([journeyPattern], referenceDate);

      expect(result.status).toBe('negative');
      expect(result.daysUntilUnavailable).toBe(0);
    });

    it('should return neutral status when available exactly 1 day', () => {
      const referenceDate = new CalendarDate(2024, 6, 1);
      const journeyPattern = createJourneyPatternWithAvailability(
        '2024-05-01',
        '2024-06-02', // ends tomorrow
      );

      const result = calculateLineAvailability([journeyPattern], referenceDate);

      expect(result.status).toBe('neutral');
      expect(result.daysUntilUnavailable).toBe(1);
    });

    it('should use current date when no reference date provided', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-01T12:00:00'));

      try {
        const journeyPattern = createJourneyPatternWithAvailability(
          '2024-06-01',
          '2024-12-31',
        );

        const result = calculateLineAvailability([journeyPattern]);

        expect(result.status).toBe('positive');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('mapStatusToText', () => {
    it('should return correct text for positive status', () => {
      expect(mapStatusToText('positive')).toBe('Available next 120 days');
    });

    it('should return correct text for neutral status', () => {
      expect(mapStatusToText('neutral')).toBe(
        'Becomes unavailable in less than 120 days',
      );
    });

    it('should return correct text for negative status', () => {
      expect(mapStatusToText('negative')).toBe('No longer available');
    });
  });
});
