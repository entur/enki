import { describe, it, expect, beforeEach } from 'vitest';
import { IntlShape } from 'react-intl';
import {
  resetIdCounters,
  createPassingTime,
  createFirstStopPassingTime,
  createLastStopPassingTime,
  createMiddleStopPassingTime,
  createPassingTimeSequence,
} from 'test/factories';
import { validateTimes } from './passingTime';

/**
 * Mock IntlShape that returns the message key as the formatted message.
 * This allows tests to verify which error message key was returned.
 */
const mockIntl: IntlShape = {
  formatMessage: ({ id }: { id: string }) => id,
} as IntlShape;

describe('validateTimes', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('basic validation', () => {
    it('returns invalid when less than 2 passing times', () => {
      const result = validateTimes([], mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorStopPoints');
    });

    it('returns invalid when only 1 passing time', () => {
      const result = validateTimes([createFirstStopPassingTime()], mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorStopPoints');
    });

    it('returns invalid when passing time has no fields set', () => {
      const passingTimes = [
        createFirstStopPassingTime(),
        createPassingTime({
          arrivalTime: null,
          departureTime: null,
          earliestDepartureTime: null,
          latestArrivalTime: null,
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorAllPassingTimesMustBeFilled');
    });
  });

  describe('within-stop time ordering', () => {
    it('returns invalid when departureTime is before arrivalTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createMiddleStopPassingTime('10:00:00', '09:30:00'), // departure before arrival
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorDepartureAfterArrival');
    });

    it('returns invalid when latestArrivalTime is before earliestDepartureTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createPassingTime({
          arrivalTime: '10:00:00',
          departureTime: '10:05:00',
          earliestDepartureTime: '10:10:00',
          latestArrivalTime: '10:00:00', // before earliestDepartureTime
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorDepartureAfterArrival');
    });

    it('returns invalid when departureTime is before earliestDepartureTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createPassingTime({
          arrivalTime: '10:00:00',
          departureTime: '10:00:00',
          earliestDepartureTime: '10:05:00', // after departureTime
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorDepartureAfterEarliest');
    });

    it('returns invalid when latestArrivalTime is before arrivalTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createPassingTime({
          arrivalTime: '10:10:00',
          departureTime: '10:15:00',
          latestArrivalTime: '10:05:00', // before arrivalTime
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorArrivalBeforeLatest');
    });
  });

  describe('last stop validation', () => {
    it('returns invalid when last stop has no arrivalTime or latestArrivalTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createPassingTime({
          departureTime: '10:00:00',
          arrivalTime: null,
          latestArrivalTime: null,
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLastArrivalMustBeSet');
    });

    it('returns valid when last stop has arrivalTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createLastStopPassingTime('10:00:00'),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
    });

    it('returns valid when last stop has latestArrivalTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createPassingTime({
          arrivalTime: null,
          departureTime: null,
          latestArrivalTime: '10:00:00',
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
    });
  });

  describe('sequential ordering (times must not be before previous)', () => {
    it('returns invalid when departureTime is before previous departureTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('10:00:00'),
        createMiddleStopPassingTime('09:00:00', '09:05:00'), // before previous
        createLastStopPassingTime('11:00:00'),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns invalid when arrivalTime is before previous arrivalTime', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createMiddleStopPassingTime('09:30:00', '09:35:00'),
        createLastStopPassingTime('09:20:00'), // before previous
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns valid for correctly sequenced times', () => {
      const passingTimes = createPassingTimeSequence(4);
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });
  });

  describe('day offset handling (overnight journeys)', () => {
    it('returns valid for overnight journey with day offset', () => {
      const passingTimes = [
        createFirstStopPassingTime('23:00:00'),
        createPassingTime({
          arrivalTime: '00:30:00',
          departureTime: '00:35:00',
          arrivalDayOffset: 1,
          departureDayOffset: 1,
        }),
        createPassingTime({
          arrivalTime: '01:00:00',
          arrivalDayOffset: 1,
          departureTime: null,
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
    });

    it('returns invalid for overnight journey without proper day offset', () => {
      const passingTimes = [
        createFirstStopPassingTime('23:00:00'),
        createPassingTime({
          arrivalTime: '00:30:00',
          departureTime: '00:35:00',
          arrivalDayOffset: 0, // Missing day offset
          departureDayOffset: 0,
        }),
        createLastStopPassingTime('01:00:00'),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });
  });

  describe('first stop special case', () => {
    it('skips sequential validation for first stop (index 0)', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createLastStopPassingTime('10:00:00'),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
    });
  });

  describe('flexible time fields validation', () => {
    it('returns invalid when earliestDepartureTime is before previous earliestDepartureTime', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:00:00',
          earliestDepartureTime: '08:45:00',
        }),
        createPassingTime({
          arrivalTime: '09:30:00',
          departureTime: '09:35:00',
          earliestDepartureTime: '08:30:00', // before previous earliestDepartureTime
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns invalid when latestArrivalTime is before previous latestArrivalTime', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:00:00',
          latestArrivalTime: '09:30:00',
        }),
        createPassingTime({
          arrivalTime: '09:20:00', // valid within-stop: arrivalTime < latestArrivalTime
          departureTime: null,
          latestArrivalTime: '09:25:00', // before previous latestArrivalTime (09:30)
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns invalid when earliestDepartureTime is before previous departureTime', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:00:00',
        }),
        createPassingTime({
          arrivalTime: '09:30:00',
          departureTime: '09:35:00',
          earliestDepartureTime: '08:55:00', // before previous departureTime
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns invalid when earliestDepartureTime is before previous arrivalTime', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:00:00',
          arrivalTime: '08:55:00',
        }),
        createPassingTime({
          arrivalTime: '09:30:00',
          departureTime: '09:35:00',
          earliestDepartureTime: '08:50:00', // before previous arrivalTime
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns invalid when arrivalTime is before previous earliestDepartureTime', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:10:00', // valid within-stop: departureTime >= earliestDepartureTime
          earliestDepartureTime: '09:00:00',
        }),
        createPassingTime({
          arrivalTime: '08:55:00', // before previous earliestDepartureTime (09:00)
          departureTime: null,
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });

    it('returns invalid when arrivalTime is before previous latestArrivalTime', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:00:00',
          latestArrivalTime: '09:30:00',
        }),
        createPassingTime({
          arrivalTime: '09:25:00', // before previous latestArrivalTime
          departureTime: null,
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('errorLaterThanPrevious');
    });
  });

  describe('valid passing time sequences', () => {
    it('returns valid for minimal two-stop journey', () => {
      const passingTimes = [
        createFirstStopPassingTime('09:00:00'),
        createLastStopPassingTime('09:30:00'),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('returns valid for journey with flexible times', () => {
      const passingTimes = [
        createPassingTime({
          departureTime: '09:00:00',
          earliestDepartureTime: '08:55:00',
        }),
        createPassingTime({
          arrivalTime: '09:30:00',
          departureTime: '09:35:00',
          earliestDepartureTime: '09:30:00',
          latestArrivalTime: '09:45:00',
        }),
        createPassingTime({
          arrivalTime: '10:00:00',
          departureTime: null,
          latestArrivalTime: '10:15:00',
        }),
      ];
      const result = validateTimes(passingTimes, mockIntl);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });
  });
});
