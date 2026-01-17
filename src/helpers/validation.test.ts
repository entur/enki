import { describe, it, expect, beforeEach } from 'vitest';
import { IntlShape } from 'react-intl';
import {
  resetIdCounters,
  createTime,
  createDate,
  createQuayStopPoint,
  createFlexibleStopPoint,
  createFirstStopPoint,
  createLastStopPoint,
  createStopPointSequence,
  createFlexibleStopPointSequence,
  createPassingTime,
  createFirstStopPassingTime,
  createLastStopPassingTime,
  createMiddleStopPassingTime,
  createPassingTimeSequence,
  createDayType,
  createWeekendDayType,
  createSingleDayType,
  createExpiredDayType,
  createFutureDayType,
  createDayTypeAssignment,
  createOperatingPeriod,
} from 'test/factories';
import { DAY_OF_WEEK } from 'model/enums';
import {
  // Time helpers
  isBefore,
  isAfter,
  // Stop point validation
  validateStopPoint,
  validateFlexibleAreasOnlyStopPoint,
  getStopPointsErrors,
  getFlexibleAreasOnlyStopPointsErrors,
  validateStopPoints,
  validateFlexibleAreasOnlyStopPoints,
  StopPointsFormError,
  // Passing time validation
  validateTimes,
  // Day type validation
  validateDayType,
  validateDayTypes,
  // Booking arrangement validation
  validateBookingArrangement,
  // Service journey validation
  validateServiceJourney,
  validServiceJourneys,
  // Journey pattern validation
  validJourneyPattern,
  validFlexibleLineJourneyPattern,
  // Line step validation
  aboutLineStepIsValid,
  aboutFlexibleLineStepIsValid,
  // Step index functions
  getMaxAllowedStepIndex,
  getMaxAllowedFlexibleLineStepIndex,
  currentStepIsValid,
  currentFlexibleLineStepIsValid,
  // Top-level validators
  validLine,
  validFlexibleLine,
} from './validation';

/**
 * Mock IntlShape that returns the message key as the formatted message.
 * This allows tests to verify which error message key was returned.
 */
const mockIntl: IntlShape = {
  formatMessage: ({ id }: { id: string }) => id,
} as IntlShape;

describe('validation', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('isBefore', () => {
    it('returns false when first time is undefined', () => {
      expect(isBefore(undefined, 0, '10:00:00', 0)).toBe(false);
    });

    it('returns false when second time is undefined', () => {
      expect(isBefore('09:00:00', 0, undefined, 0)).toBe(false);
    });

    it('returns true when first time is earlier on same day', () => {
      expect(isBefore('09:00:00', 0, '10:00:00', 0)).toBe(true);
    });

    it('returns false when first time is later on same day', () => {
      expect(isBefore('11:00:00', 0, '10:00:00', 0)).toBe(false);
    });

    it('returns false when times are equal', () => {
      expect(isBefore('10:00:00', 0, '10:00:00', 0)).toBe(false);
    });

    it('returns true when first time is on earlier day', () => {
      expect(isBefore('23:00:00', 0, '01:00:00', 1)).toBe(true);
    });

    it('returns false when first time is on later day', () => {
      expect(isBefore('01:00:00', 1, '23:00:00', 0)).toBe(false);
    });

    it('handles null day offsets as 0', () => {
      expect(isBefore('09:00:00', undefined, '10:00:00', undefined)).toBe(true);
    });

    it('returns false for invalid time format', () => {
      expect(isBefore('invalid', 0, '10:00:00', 0)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('returns false when first time is undefined', () => {
      expect(isAfter(undefined, 0, '10:00:00', 0)).toBe(false);
    });

    it('returns false when second time is undefined', () => {
      expect(isAfter('09:00:00', 0, undefined, 0)).toBe(false);
    });

    it('returns true when first time is later on same day', () => {
      expect(isAfter('11:00:00', 0, '10:00:00', 0)).toBe(true);
    });

    it('returns false when first time is earlier on same day', () => {
      expect(isAfter('09:00:00', 0, '10:00:00', 0)).toBe(false);
    });

    it('returns false when times are equal', () => {
      expect(isAfter('10:00:00', 0, '10:00:00', 0)).toBe(false);
    });

    it('returns true when first time is on later day', () => {
      expect(isAfter('01:00:00', 1, '23:00:00', 0)).toBe(true);
    });

    it('returns false when first time is on earlier day', () => {
      expect(isAfter('23:00:00', 0, '01:00:00', 1)).toBe(false);
    });

    it('returns false for invalid time format', () => {
      expect(isAfter('invalid', 0, '10:00:00', 0)).toBe(false);
    });
  });

  describe('validateStopPoint', () => {
    describe('stopPlace validation', () => {
      it('returns error when both quayRef and flexibleStopPlaceRef are blank', () => {
        const stopPoint = createQuayStopPoint(undefined, {
          quayRef: null,
          flexibleStopPlaceRef: null,
        });
        const result = validateStopPoint(stopPoint, false, false);
        expect(result.stopPlace).toBe('flexibleStopPlaceRefAndQuayRefNoValues');
      });

      it('returns no error when quayRef is set', () => {
        const stopPoint = createQuayStopPoint('TST:Quay:1');
        const result = validateStopPoint(stopPoint, false, false);
        expect(result.stopPlace).toBeUndefined();
      });

      it('returns no error when flexibleStopPlaceRef is set', () => {
        const stopPoint = createFlexibleStopPoint();
        const result = validateStopPoint(stopPoint, false, false);
        expect(result.stopPlace).toBeUndefined();
      });
    });

    describe('frontText validation', () => {
      it('returns error for first stop without frontText', () => {
        const stopPoint = createFirstStopPoint(undefined, {
          destinationDisplay: { frontText: '' },
        });
        const result = validateStopPoint(stopPoint, true, false);
        expect(result.frontText).toBe('frontTextNoValue');
      });

      it('returns no error for first stop with frontText', () => {
        const stopPoint = createFirstStopPoint();
        const result = validateStopPoint(stopPoint, true, false);
        expect(result.frontText).toBeUndefined();
      });

      it('returns no error for middle stop without frontText', () => {
        const stopPoint = createQuayStopPoint(undefined, {
          destinationDisplay: null,
        });
        const result = validateStopPoint(stopPoint, false, false);
        expect(result.frontText).toBeUndefined();
      });

      it('returns no error for last stop without frontText', () => {
        const stopPoint = createLastStopPoint();
        const result = validateStopPoint(stopPoint, false, true);
        expect(result.frontText).toBeUndefined();
      });
    });

    describe('boarding validation', () => {
      it('returns error for first stop with forAlighting=true', () => {
        const stopPoint = createFirstStopPoint(undefined, {
          forAlighting: true,
        });
        const result = validateStopPoint(stopPoint, true, false);
        expect(result.boarding).toBe('frontTextAlighting');
      });

      it('returns error for first stop with forBoarding=false', () => {
        const stopPoint = createFirstStopPoint(undefined, {
          forBoarding: false,
        });
        const result = validateStopPoint(stopPoint, true, false);
        expect(result.boarding).toBe('frontTextAlighting');
      });

      it('returns no error for valid first stop', () => {
        const stopPoint = createFirstStopPoint();
        const result = validateStopPoint(stopPoint, true, false);
        expect(result.boarding).toBeUndefined();
      });

      it('returns error for last stop with forBoarding=true', () => {
        const stopPoint = createLastStopPoint(undefined, {
          forBoarding: true,
        });
        const result = validateStopPoint(stopPoint, false, true);
        expect(result.boarding).toBe('frontTextBoarding');
      });

      it('returns error for last stop with forAlighting=false', () => {
        const stopPoint = createLastStopPoint(undefined, {
          forAlighting: false,
        });
        const result = validateStopPoint(stopPoint, false, true);
        expect(result.boarding).toBe('frontTextBoarding');
      });

      it('returns no error for valid last stop', () => {
        const stopPoint = createLastStopPoint();
        const result = validateStopPoint(stopPoint, false, true);
        expect(result.boarding).toBeUndefined();
      });

      it('returns no error for middle stop with any boarding configuration', () => {
        const stopPoint = createQuayStopPoint();
        const result = validateStopPoint(stopPoint, false, false);
        expect(result.boarding).toBeUndefined();
      });
    });

    it('returns all errors for invalid stop point', () => {
      const stopPoint = createQuayStopPoint(undefined, {
        quayRef: null,
        flexibleStopPlaceRef: null,
        destinationDisplay: { frontText: '' },
        forBoarding: false,
        forAlighting: true,
      });
      const result = validateStopPoint(stopPoint, true, false);
      expect(result.stopPlace).toBe('flexibleStopPlaceRefAndQuayRefNoValues');
      expect(result.frontText).toBe('frontTextNoValue');
      expect(result.boarding).toBe('frontTextAlighting');
    });
  });

  describe('validateFlexibleAreasOnlyStopPoint', () => {
    it('returns error when flexibleStopPlaceRef is not set', () => {
      const stopPoint = createFlexibleStopPoint({
        flexibleStopPlaceRef: null,
      });
      const result = validateFlexibleAreasOnlyStopPoint(stopPoint, false);
      expect(result.stopPlace).toBe('flexibleStopPlaceRefAndQuayRefNoValues');
    });

    it('returns no error when flexibleStopPlaceRef is set', () => {
      const stopPoint = createFlexibleStopPoint();
      const result = validateFlexibleAreasOnlyStopPoint(stopPoint, false);
      expect(result.stopPlace).toBeUndefined();
    });

    it('returns frontText error for first stop without frontText', () => {
      const stopPoint = createFlexibleStopPoint({
        destinationDisplay: { frontText: '' },
      });
      const result = validateFlexibleAreasOnlyStopPoint(stopPoint, true);
      expect(result.frontText).toBe('frontTextNoValue');
    });

    it('never returns boarding error (always undefined)', () => {
      const stopPoint = createFlexibleStopPoint({
        forBoarding: false,
        forAlighting: false,
      });
      const result = validateFlexibleAreasOnlyStopPoint(stopPoint, true);
      expect(result.boarding).toBeUndefined();
    });
  });

  describe('getStopPointsErrors', () => {
    it('returns array of errors for each stop point', () => {
      const stopPoints = createStopPointSequence(3);
      const errors = getStopPointsErrors(stopPoints);
      expect(errors).toHaveLength(3);
    });

    it('validates first stop as first, last stop as last', () => {
      const stopPoints = [
        createFirstStopPoint(undefined, { forBoarding: false }), // Invalid first
        createQuayStopPoint(),
        createLastStopPoint(undefined, { forAlighting: false }), // Invalid last
      ];
      const errors = getStopPointsErrors(stopPoints);
      expect(errors[0].boarding).toBe('frontTextAlighting');
      expect(errors[1].boarding).toBeUndefined();
      expect(errors[2].boarding).toBe('frontTextBoarding');
    });
  });

  describe('validateStopPoints', () => {
    it('returns false when less than 2 stop points', () => {
      expect(validateStopPoints([])).toBe(false);
      expect(validateStopPoints([createFirstStopPoint()])).toBe(false);
    });

    it('returns false when any stop point has errors', () => {
      const stopPoints = [
        createFirstStopPoint(undefined, {
          quayRef: null,
          flexibleStopPlaceRef: null,
        }),
        createLastStopPoint(),
      ];
      expect(validateStopPoints(stopPoints)).toBe(false);
    });

    it('returns true when all stop points are valid', () => {
      const stopPoints = createStopPointSequence(3);
      expect(validateStopPoints(stopPoints)).toBe(true);
    });
  });

  describe('validateFlexibleAreasOnlyStopPoints', () => {
    it('returns false when any flexible stop has errors', () => {
      const stopPoints = [
        createFlexibleStopPoint({ flexibleStopPlaceRef: null }),
        createFlexibleStopPoint(),
      ];
      expect(validateFlexibleAreasOnlyStopPoints(stopPoints)).toBe(false);
    });

    it('returns true when all flexible stops are valid', () => {
      const stopPoints = createFlexibleStopPointSequence(3);
      // Need to add destinationDisplay.frontText to first stop for valid sequence
      stopPoints[0] = {
        ...stopPoints[0],
        destinationDisplay: { frontText: 'Test' },
      };
      expect(validateFlexibleAreasOnlyStopPoints(stopPoints)).toBe(true);
    });
  });

  describe('validateTimes', () => {
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
