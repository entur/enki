import { describe, it, expect, beforeEach } from 'vitest';
import { dayTypeToPayload, dayTypeIsEmpty } from './DayType';
import {
  createDayType,
  createWeekendDayType,
  createSingleDayType,
  createEmptyDayType,
  createDayTypeAssignment,
  resetIdCounters,
} from 'test/factories';
import { DAY_OF_WEEK } from 'model/enums';

describe('dayTypeToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('property removal', () => {
    it('removes numberOfServiceJourneys property', () => {
      const dayType = createDayType({
        numberOfServiceJourneys: 42,
      });

      const result = dayTypeToPayload(dayType);

      expect(result).not.toHaveProperty('numberOfServiceJourneys');
    });

    it('handles dayType without numberOfServiceJourneys', () => {
      const dayType = createDayType();
      delete (dayType as Record<string, unknown>)['numberOfServiceJourneys'];

      const result = dayTypeToPayload(dayType);

      expect(result).not.toHaveProperty('numberOfServiceJourneys');
    });

    it('handles numberOfServiceJourneys with value 0', () => {
      const dayType = createDayType({
        numberOfServiceJourneys: 0,
      });

      const result = dayTypeToPayload(dayType);

      expect(result).not.toHaveProperty('numberOfServiceJourneys');
    });
  });

  describe('property passthrough', () => {
    it('preserves id property', () => {
      const dayType = createDayType({
        id: 'TST:DayType:weekday',
      });

      const result = dayTypeToPayload(dayType);

      expect(result.id).toBe('TST:DayType:weekday');
    });

    it('preserves name property', () => {
      const dayType = createDayType({
        name: 'Weekdays',
      });

      const result = dayTypeToPayload(dayType);

      expect(result.name).toBe('Weekdays');
    });

    it('preserves changed property', () => {
      const dayType = createDayType({
        changed: '2024-01-15T12:00:00Z',
      });

      const result = dayTypeToPayload(dayType);

      expect(result.changed).toBe('2024-01-15T12:00:00Z');
    });

    it('preserves daysOfWeek property', () => {
      const dayType = createDayType({
        daysOfWeek: [
          DAY_OF_WEEK.MONDAY,
          DAY_OF_WEEK.WEDNESDAY,
          DAY_OF_WEEK.FRIDAY,
        ],
      });

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toEqual([
        DAY_OF_WEEK.MONDAY,
        DAY_OF_WEEK.WEDNESDAY,
        DAY_OF_WEEK.FRIDAY,
      ]);
    });

    it('preserves dayTypeAssignments property', () => {
      const assignments = [
        createDayTypeAssignment({ id: 'TST:DayTypeAssignment:1' }),
        createDayTypeAssignment({ id: 'TST:DayTypeAssignment:2' }),
      ];
      const dayType = createDayType({
        dayTypeAssignments: assignments,
      });

      const result = dayTypeToPayload(dayType);

      expect(result.dayTypeAssignments).toHaveLength(2);
      expect(result.dayTypeAssignments[0].id).toBe('TST:DayTypeAssignment:1');
      expect(result.dayTypeAssignments[1].id).toBe('TST:DayTypeAssignment:2');
    });

    it('preserves empty daysOfWeek array', () => {
      const dayType = createEmptyDayType();

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toEqual([]);
    });

    it('preserves empty dayTypeAssignments array', () => {
      const dayType = createEmptyDayType();

      const result = dayTypeToPayload(dayType);

      expect(result.dayTypeAssignments).toEqual([]);
    });

    it('preserves undefined name', () => {
      const dayType = createDayType();
      delete (dayType as Record<string, unknown>)['name'];

      const result = dayTypeToPayload(dayType);

      expect(result.name).toBeUndefined();
    });

    it('preserves undefined changed', () => {
      const dayType = createDayType();
      delete (dayType as Record<string, unknown>)['changed'];

      const result = dayTypeToPayload(dayType);

      expect(result.changed).toBeUndefined();
    });
  });

  describe('preset day types', () => {
    it('handles weekday day type', () => {
      const dayType = createDayType();

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.MONDAY);
      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.TUESDAY);
      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.WEDNESDAY);
      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.THURSDAY);
      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.FRIDAY);
      expect(result.daysOfWeek).not.toContain(DAY_OF_WEEK.SATURDAY);
      expect(result.daysOfWeek).not.toContain(DAY_OF_WEEK.SUNDAY);
    });

    it('handles weekend day type', () => {
      const dayType = createWeekendDayType();

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.SATURDAY);
      expect(result.daysOfWeek).toContain(DAY_OF_WEEK.SUNDAY);
      expect(result.daysOfWeek).toHaveLength(2);
    });

    it('handles single day type', () => {
      const dayType = createSingleDayType(DAY_OF_WEEK.WEDNESDAY);

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toEqual([DAY_OF_WEEK.WEDNESDAY]);
    });
  });

  describe('edge cases', () => {
    it('handles day type with all days', () => {
      const dayType = createDayType({
        daysOfWeek: [
          DAY_OF_WEEK.MONDAY,
          DAY_OF_WEEK.TUESDAY,
          DAY_OF_WEEK.WEDNESDAY,
          DAY_OF_WEEK.THURSDAY,
          DAY_OF_WEEK.FRIDAY,
          DAY_OF_WEEK.SATURDAY,
          DAY_OF_WEEK.SUNDAY,
        ],
      });

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toHaveLength(7);
    });

    it('handles day type with multiple assignments', () => {
      const dayType = createDayType({
        dayTypeAssignments: [
          createDayTypeAssignment({ isAvailable: true }),
          createDayTypeAssignment({ isAvailable: false }),
          createDayTypeAssignment({ isAvailable: true }),
        ],
      });

      const result = dayTypeToPayload(dayType);

      expect(result.dayTypeAssignments).toHaveLength(3);
      expect(result.dayTypeAssignments[0].isAvailable).toBe(true);
      expect(result.dayTypeAssignments[1].isAvailable).toBe(false);
      expect(result.dayTypeAssignments[2].isAvailable).toBe(true);
    });

    it('handles minimal day type', () => {
      const dayType: any = {
        daysOfWeek: [],
        dayTypeAssignments: [],
      };

      const result = dayTypeToPayload(dayType);

      expect(result.daysOfWeek).toEqual([]);
      expect(result.dayTypeAssignments).toEqual([]);
      expect(result).not.toHaveProperty('numberOfServiceJourneys');
    });

    it('handles day type with all properties', () => {
      const dayType = createDayType({
        id: 'TST:DayType:full',
        name: 'Full Day Type',
        changed: '2024-01-15T12:00:00Z',
        daysOfWeek: [DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.FRIDAY],
        dayTypeAssignments: [createDayTypeAssignment()],
        numberOfServiceJourneys: 100,
      });

      const result = dayTypeToPayload(dayType);

      expect(result.id).toBe('TST:DayType:full');
      expect(result.name).toBe('Full Day Type');
      expect(result.changed).toBe('2024-01-15T12:00:00Z');
      expect(result.daysOfWeek).toEqual([
        DAY_OF_WEEK.MONDAY,
        DAY_OF_WEEK.FRIDAY,
      ]);
      expect(result.dayTypeAssignments).toHaveLength(1);
      expect(result).not.toHaveProperty('numberOfServiceJourneys');
    });
  });
});

describe('dayTypeIsEmpty', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('empty detection', () => {
    it('returns true when both arrays are empty', () => {
      const dayType = createEmptyDayType();

      expect(dayTypeIsEmpty(dayType)).toBe(true);
    });

    it('returns false when daysOfWeek has elements', () => {
      const dayType = createDayType({
        daysOfWeek: [DAY_OF_WEEK.MONDAY],
        dayTypeAssignments: [],
      });

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });

    it('returns false when dayTypeAssignments has elements', () => {
      const dayType = createDayType({
        daysOfWeek: [],
        dayTypeAssignments: [createDayTypeAssignment()],
      });

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });

    it('returns false when both arrays have elements', () => {
      const dayType = createDayType();

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles day type with single day', () => {
      const dayType = createSingleDayType(DAY_OF_WEEK.SUNDAY);

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });

    it('handles day type with single assignment', () => {
      const dayType = createDayType({
        daysOfWeek: [],
        dayTypeAssignments: [createDayTypeAssignment()],
      });

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });

    it('handles weekday day type', () => {
      const dayType = createDayType();

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });

    it('handles weekend day type', () => {
      const dayType = createWeekendDayType();

      expect(dayTypeIsEmpty(dayType)).toBe(false);
    });
  });
});
