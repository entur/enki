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
  createBookingArrangement,
  createMinimalBookingArrangement,
  createServiceJourney,
  createServiceJourneyWithPassingTimes,
  createServiceJourneyWithDayTypes,
  createJourneyPattern,
  createFlexibleJourneyPattern,
  createEmptyJourneyPattern,
  createMinimalJourneyPattern,
  createLine,
  createLineWithNetwork,
  createFlexibleLine,
  createFlexibleLineWithNetwork,
  createFlexibleLineWithType,
  createEmptyLine,
  createEmptyFlexibleLine,
} from 'test/factories';
import { FlexibleLineType } from 'model/FlexibleLine';
import { DAY_OF_WEEK, VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';
import BookingArrangement from 'model/BookingArrangement';
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

  describe('validateBookingArrangement', () => {
    describe('mutual exclusivity: minimumBookingPeriod vs bookWhen', () => {
      it('returns false when both minimumBookingPeriod and bookWhen are set', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT1H',
          bookWhen: 'advanceAndDayOfTravel' as any,
          latestBookingTime: '08:00:00',
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(false);
      });

      it('returns true when only minimumBookingPeriod is set', () => {
        // Note: Using null to clear fields since deepMerge skips undefined
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT1H',
          bookWhen: null as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });

      it('returns true when only bookWhen and latestBookingTime are set', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: null as any,
          bookWhen: 'advanceAndDayOfTravel' as any,
          latestBookingTime: '08:00:00',
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });
    });

    describe('required pairs: bookWhen and latestBookingTime', () => {
      it('returns false when bookWhen is set but latestBookingTime is not', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: null as any,
          bookWhen: 'advanceAndDayOfTravel' as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(false);
      });

      it('returns false when latestBookingTime is set but bookWhen is not', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: null as any,
          bookWhen: null as any,
          latestBookingTime: '08:00:00',
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(false);
      });

      it('returns true when both bookWhen and latestBookingTime are set together', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: null as any,
          bookWhen: 'dayOfTravelOnly' as any,
          latestBookingTime: '10:00:00',
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });
    });

    describe('at least one booking option required', () => {
      it('returns false when no booking timing option is set', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: null as any,
          bookWhen: null as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(false);
      });

      it('returns true with minimumBookingPeriod alone', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT30M',
          bookWhen: null as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });

      it('returns true with bookWhen and latestBookingTime together', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: null as any,
          bookWhen: 'untilPreviousDay' as any,
          latestBookingTime: '18:00:00',
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });
    });

    describe('undefined/null input handling', () => {
      it('returns false when bookingArrangement is undefined', () => {
        expect(validateBookingArrangement(undefined)).toBe(false);
      });

      it('returns false when bookingArrangement is an empty object', () => {
        expect(validateBookingArrangement({})).toBe(false);
      });
    });

    describe('various minimumBookingPeriod formats', () => {
      it('returns true for ISO 8601 duration format PT10M (10 minutes)', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT10M',
          bookWhen: null as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });

      it('returns true for ISO 8601 duration format PT2H (2 hours)', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT2H',
          bookWhen: null as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });

      it('returns true for ISO 8601 duration format P1D (1 day)', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'P1D',
          bookWhen: null as any,
          latestBookingTime: null as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });
    });

    describe('integration with other BookingArrangement fields', () => {
      it('validates regardless of other optional fields being set', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT1H',
          bookWhen: null as any,
          latestBookingTime: null as any,
          bookingNote: 'Please book in advance',
          bookingAccess: 'public' as any,
          bookingMethods: ['callOffice'] as any,
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });

      it('validates with contact information set', () => {
        const bookingArrangement = createBookingArrangement({
          minimumBookingPeriod: 'PT1H',
          bookWhen: null as any,
          latestBookingTime: null as any,
          bookingContact: {
            contactPerson: 'John Doe',
            phone: '+47 123 45 678',
            email: 'booking@example.com',
          },
        });
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });

      it('validates a minimal booking arrangement with only required fields', () => {
        // Create a minimal valid arrangement: only minimumBookingPeriod is needed
        // (without bookWhen/latestBookingTime pair)
        const bookingArrangement: BookingArrangement = {
          minimumBookingPeriod: 'PT30M',
        };
        expect(validateBookingArrangement(bookingArrangement)).toBe(true);
      });
    });
  });

  describe('validateServiceJourney', () => {
    describe('name validation', () => {
      it('returns false when name is null', () => {
        // Note: Using null since deepMerge skips undefined values
        const sj = createServiceJourneyWithDayTypes({
          name: null as any,
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when name is empty string', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: '',
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when name is whitespace only', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: '   ',
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when name is provided', () => {
        const sj = createServiceJourneyWithDayTypes({
          name: 'Morning Express',
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('passing times validation', () => {
      it('returns false when passingTimes is undefined', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: undefined,
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when passingTimes is empty', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: [],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when only one passing time (need at least 2)', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: [createFirstStopPassingTime('09:00:00')],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when passing times have invalid ordering', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: [
            createFirstStopPassingTime('10:00:00'),
            createLastStopPassingTime('09:00:00'), // Before first
          ],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when passing times are valid', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(3),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('dayTypes validation', () => {
      it('returns false when dayTypes is undefined', () => {
        const sj = createServiceJourney({
          dayTypes: undefined,
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when dayTypes is empty array', () => {
        const sj = createServiceJourney({
          dayTypes: [],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when first dayType has empty daysOfWeek', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType({ daysOfWeek: [] })],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when first dayType has null daysOfWeek', () => {
        // Note: Using null since deepMerge skips undefined values
        const sj = createServiceJourney({
          dayTypes: [createDayType({ daysOfWeek: null as any })],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns false when dayType has invalid date range', () => {
        const sj = createServiceJourney({
          dayTypes: [
            createDayType({
              dayTypeAssignments: [
                createDayTypeAssignment({
                  operatingPeriod: {
                    fromDate: 'invalid-date',
                    toDate: '2024-12-31',
                  },
                }),
              ],
            }),
          ],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when dayType is valid with daysOfWeek set', () => {
        const sj = createServiceJourneyWithDayTypes({
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });

      it('returns true when multiple dayTypes are valid', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType(), createWeekendDayType()],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('validDayTimes check (first dayType daysOfWeek)', () => {
      it('returns false when first dayType has no daysOfWeek but subsequent ones do', () => {
        // The validation checks specifically dayTypes?.[0]?.daysOfWeek?.length
        // So even if second dayType has daysOfWeek, first must have them
        const sj = createServiceJourney({
          dayTypes: [
            createDayType({ daysOfWeek: [] }),
            createDayType(), // Has valid daysOfWeek
          ],
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('returns true when first dayType has daysOfWeek', () => {
        const sj = createServiceJourney({
          dayTypes: [createDayType()], // Has weekday daysOfWeek by default
          passingTimes: createPassingTimeSequence(2),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });

    describe('combined validation', () => {
      it('returns true for fully valid service journey', () => {
        const sj = createServiceJourneyWithPassingTimes(4);
        sj.dayTypes = [createDayType()];
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });

      it('returns false when multiple validation rules fail', () => {
        const sj = createServiceJourney({
          name: '',
          dayTypes: [],
          passingTimes: [],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(false);
      });

      it('validates with weekend day type', () => {
        const sj = createServiceJourney({
          name: 'Weekend Service',
          dayTypes: [createWeekendDayType()],
          passingTimes: createPassingTimeSequence(3),
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });

      it('validates overnight service journey', () => {
        const sj = createServiceJourney({
          name: 'Night Service',
          dayTypes: [createDayType()],
          passingTimes: [
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
          ],
        });
        expect(validateServiceJourney(sj, mockIntl)).toBe(true);
      });
    });
  });

  describe('validServiceJourneys', () => {
    describe('undefined/empty input handling', () => {
      it('returns false when serviceJourneys is undefined', () => {
        expect(validServiceJourneys(undefined, mockIntl)).toBe(false);
      });

      it('returns true when serviceJourneys is empty array (vacuous truth)', () => {
        // Note: empty array passes because [].every() returns true
        // This is similar to validateDayTypes behavior
        expect(validServiceJourneys([], mockIntl)).toBe(true);
      });
    });

    describe('array validation', () => {
      it('returns true when all service journeys are valid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: 'Morning',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Afternoon',
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(true);
      });

      it('returns false when any service journey is invalid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: 'Valid Journey',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: '', // Invalid: empty name
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });

      it('returns false when first service journey is invalid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Valid',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });

      it('returns false when last service journey is invalid', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            name: 'Valid',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Also Valid',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourney({
            name: 'Invalid - no dayTypes',
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });
    });

    describe('single service journey', () => {
      it('returns true for single valid service journey', () => {
        const sjs = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(true);
      });

      it('returns false for single invalid service journey', () => {
        const sjs = [
          createServiceJourney({
            name: 'Missing Day Types',
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(false);
      });
    });

    describe('mixed day types', () => {
      it('validates journeys with different day types', () => {
        const sjs = [
          createServiceJourney({
            name: 'Weekday Service',
            dayTypes: [createDayType()], // Mon-Fri
            passingTimes: createPassingTimeSequence(3),
          }),
          createServiceJourney({
            name: 'Weekend Service',
            dayTypes: [createWeekendDayType()], // Sat-Sun
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        expect(validServiceJourneys(sjs, mockIntl)).toBe(true);
      });
    });
  });

  describe('validJourneyPattern', () => {
    describe('undefined/null input handling', () => {
      it('returns false when journeyPattern is undefined', () => {
        expect(validJourneyPattern(undefined)).toBe(false);
      });

      it('returns false when journeyPattern is null', () => {
        expect(validJourneyPattern(null as any)).toBe(false);
      });
    });

    describe('name validation', () => {
      it('returns false when name is blank/empty', () => {
        const jp = createJourneyPattern({ name: '' });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when name is whitespace only', () => {
        const jp = createJourneyPattern({ name: '   ' });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when name is null', () => {
        const jp = createJourneyPattern({ name: null as any });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns true when name is provided', () => {
        const jp = createJourneyPattern({ name: 'Route A' });
        expect(validJourneyPattern(jp)).toBe(true);
      });
    });

    describe('stop points validation', () => {
      it('returns false when pointsInSequence is null/empty (coerced to empty array)', () => {
        // Note: validation uses ?? [] to coerce null/undefined to empty array
        // Factory's deepMerge skips undefined, so we test with null
        const jp = createJourneyPattern({
          pointsInSequence: null as any,
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when pointsInSequence is empty array', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when only 1 stop point (need at least 2)', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [createFirstStopPoint()],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when stop points have validation errors', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(undefined, {
              quayRef: null,
              flexibleStopPlaceRef: null, // Invalid: no stop place ref
            }),
            createLastStopPoint(),
          ],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns true when stop points are valid', () => {
        const jp = createJourneyPattern({
          pointsInSequence: createStopPointSequence(3),
        });
        expect(validJourneyPattern(jp)).toBe(true);
      });
    });

    describe('combined validation', () => {
      it('returns true for default journey pattern from factory', () => {
        const jp = createJourneyPattern();
        expect(validJourneyPattern(jp)).toBe(true);
      });

      it('returns true for minimal journey pattern (2 stops)', () => {
        const jp = createMinimalJourneyPattern();
        expect(validJourneyPattern(jp)).toBe(true);
      });

      it('returns false for empty journey pattern', () => {
        const jp = createEmptyJourneyPattern();
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('returns false when both name and stop points are invalid', () => {
        const jp = createJourneyPattern({
          name: '',
          pointsInSequence: [],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('validates journey pattern with many stops', () => {
        const jp = createJourneyPattern({
          pointsInSequence: createStopPointSequence(10),
        });
        expect(validJourneyPattern(jp)).toBe(true);
      });

      it('validates journey pattern with first stop boarding errors', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(undefined, {
              forBoarding: false, // Invalid: first stop must allow boarding
            }),
            createLastStopPoint(),
          ],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });

      it('validates journey pattern with last stop alighting errors', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(),
            createLastStopPoint(undefined, {
              forAlighting: false, // Invalid: last stop must allow alighting
            }),
          ],
        });
        expect(validJourneyPattern(jp)).toBe(false);
      });
    });
  });

  describe('validFlexibleLineJourneyPattern', () => {
    describe('FLEXIBLE_AREAS_ONLY type', () => {
      it('returns false when journeyPattern is undefined', () => {
        expect(
          validFlexibleLineJourneyPattern(
            undefined,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns false when name is blank', () => {
        const jp = createFlexibleJourneyPattern(3, { name: '' });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns false when flexible stop point has no flexibleStopPlaceRef', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              flexibleStopPlaceRef: null, // Invalid
              destinationDisplay: { frontText: 'Destination' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns false when first flexible stop has no frontText', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              destinationDisplay: { frontText: '' }, // Invalid: first stop needs frontText
            }),
            createFlexibleStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(false);
      });

      it('returns true for valid flexible journey pattern', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              destinationDisplay: { frontText: 'Flexible Area' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(true);
      });

      it('returns true with multiple flexible stops', () => {
        // Create flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(4);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Multi-stop Flexible' },
        };

        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          ),
        ).toBe(true);
      });
    });

    describe('non-FLEXIBLE_AREAS_ONLY types (falls back to validJourneyPattern)', () => {
      it('uses standard validation for CORRIDOR_SERVICE', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.CORRIDOR_SERVICE,
          ),
        ).toBe(true);
      });

      it('uses standard validation for MAIN_ROUTE_WITH_FLEXIBLE_ENDS', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
          ),
        ).toBe(true);
      });

      it('uses standard validation for HAIL_AND_RIDE_SECTIONS', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
          ),
        ).toBe(true);
      });

      it('uses standard validation for FIXED_STOP_AREA_WIDE', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.FIXED_STOP_AREA_WIDE,
          ),
        ).toBe(true);
      });

      it('uses standard validation for MIXED_FLEXIBLE', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(jp, FlexibleLineType.MIXED_FLEXIBLE),
        ).toBe(true);
      });

      it('uses standard validation for MIXED_FLEXIBLE_AND_FIXED', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
          ),
        ).toBe(true);
      });

      it('uses standard validation for FIXED', () => {
        const jp = createJourneyPattern();
        expect(
          validFlexibleLineJourneyPattern(jp, FlexibleLineType.FIXED),
        ).toBe(true);
      });

      it('returns false for invalid pattern with non-FLEXIBLE_AREAS_ONLY type', () => {
        const jp = createJourneyPattern({ name: '' });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.CORRIDOR_SERVICE,
          ),
        ).toBe(false);
      });
    });

    describe('undefined flexibleLineType', () => {
      it('uses standard validation when flexibleLineType is undefined', () => {
        const jp = createJourneyPattern();
        expect(validFlexibleLineJourneyPattern(jp, undefined)).toBe(true);
      });

      it('returns false for invalid pattern when flexibleLineType is undefined', () => {
        const jp = createJourneyPattern({ name: '' });
        expect(validFlexibleLineJourneyPattern(jp, undefined)).toBe(false);
      });
    });

    describe('mixed stop types (quay and flexible)', () => {
      it('validates journey pattern with mixed stop types for non-FLEXIBLE_AREAS_ONLY', () => {
        // Mixed stop patterns are valid for corridor service etc.
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(), // Quay-based
            createFlexibleStopPoint(), // Flexible
            createLastStopPoint(), // Quay-based
          ],
        });
        expect(
          validFlexibleLineJourneyPattern(
            jp,
            FlexibleLineType.CORRIDOR_SERVICE,
          ),
        ).toBe(true);
      });
    });
  });

  describe('aboutLineStepIsValid', () => {
    describe('name validation', () => {
      it('returns false when name is blank', () => {
        const line = createLine({
          name: '',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when name is null', () => {
        const line = createLine({
          name: null as any,
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when name is whitespace only', () => {
        const line = createLine({
          name: '   ',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });

    describe('publicCode validation', () => {
      it('returns false when publicCode is blank and optionalPublicCode is false', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
        expect(aboutLineStepIsValid(line, false)).toBe(false);
      });

      it('returns true when publicCode is blank but optionalPublicCode is true', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line, true)).toBe(true);
      });

      it('returns true when publicCode is null but optionalPublicCode is true', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: null as any,
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line, true)).toBe(true);
      });

      it('returns true when publicCode is provided', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(true);
      });
    });

    describe('operatorRef validation', () => {
      it('returns false when operatorRef is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when operatorRef is undefined', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: undefined,
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });

    describe('networkRef validation', () => {
      it('returns false when networkRef is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: '',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when networkRef is undefined', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: undefined,
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });

    describe('transportMode validation', () => {
      it('returns false when transportMode is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: '' as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportMode is null', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: null as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates with various transport modes', () => {
        const modes = [
          VEHICLE_MODE.BUS,
          VEHICLE_MODE.TRAM,
          VEHICLE_MODE.RAIL,
          VEHICLE_MODE.METRO,
          VEHICLE_MODE.WATER,
          VEHICLE_MODE.AIR,
          VEHICLE_MODE.COACH,
        ];

        modes.forEach((mode) => {
          const line = createLine({
            name: 'Test Line',
            publicCode: '42',
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportMode: mode,
            transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          });
          expect(aboutLineStepIsValid(line)).toBe(true);
        });
      });
    });

    describe('transportSubmode validation', () => {
      it('returns false when transportSubmode is blank', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: '' as any,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportSubmode is undefined', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: undefined,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates with various transport submodes', () => {
        const submodes = [
          'localBus',
          'regionalBus',
          'expressBus',
          'localTram',
          'local',
        ];

        submodes.forEach((submode) => {
          const line = createLine({
            name: 'Test Line',
            publicCode: '42',
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportMode: VEHICLE_MODE.BUS,
            transportSubmode: submode as any,
          });
          expect(aboutLineStepIsValid(line)).toBe(true);
        });
      });
    });

    describe('combined validation', () => {
      it('returns true for fully valid line', () => {
        const line = createLine({
          name: 'Express 42',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'expressBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(true);
      });

      it('returns false when multiple fields are invalid', () => {
        const line = createLine({
          name: '',
          publicCode: '',
          operatorRef: '',
          networkRef: '',
          transportMode: undefined as any,
          transportSubmode: undefined,
        });
        expect(aboutLineStepIsValid(line)).toBe(false);
      });

      it('validates line with network reference from factory', () => {
        const line = createLineWithNetwork({
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        // createLineWithNetwork sets networkRef automatically
        expect(aboutLineStepIsValid(line)).toBe(false); // Still needs operatorRef
      });

      it('validates line with all required fields', () => {
        const line = createLineWithNetwork({
          operatorRef: 'TST:Operator:1',
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutLineStepIsValid(line)).toBe(true);
      });

      it('returns false for empty line', () => {
        const line = createEmptyLine();
        expect(aboutLineStepIsValid(line)).toBe(false);
      });
    });
  });

  describe('aboutFlexibleLineStepIsValid', () => {
    describe('inherits aboutLineStepIsValid checks', () => {
      it('returns false when name is blank', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when publicCode is blank and optionalPublicCode is false', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
        expect(aboutFlexibleLineStepIsValid(line, true)).toBe(true);
      });

      it('returns false when operatorRef is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when networkRef is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: '',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportMode is null', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: null as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when transportSubmode is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: undefined,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });
    });

    describe('flexibleLineType validation (unique to flexible lines)', () => {
      it('returns false when flexibleLineType is blank', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: '' as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false when flexibleLineType is null', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns true for FLEXIBLE_AREAS_ONLY type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for CORRIDOR_SERVICE type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for MAIN_ROUTE_WITH_FLEXIBLE_ENDS type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for HAIL_AND_RIDE_SECTIONS type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for MIXED_FLEXIBLE type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for FIXED_STOP_AREA_WIDE type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FIXED_STOP_AREA_WIDE,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for MIXED_FLEXIBLE_AND_FIXED type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns true for FIXED type', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FIXED,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });
    });

    describe('combined validation', () => {
      it('returns true for fully valid flexible line', () => {
        const line = createFlexibleLine({
          name: 'Flex Express',
          publicCode: 'FLEX42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns false when multiple fields are invalid', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: '',
          operatorRef: '',
          networkRef: '',
          transportMode: undefined as any,
          transportSubmode: undefined,
          flexibleLineType: undefined as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false even with valid flexibleLineType but invalid base fields', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('returns false for valid base fields but missing flexibleLineType', () => {
        const line = createFlexibleLine({
          name: 'Valid Name',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });

      it('validates flexible line with network reference from factory', () => {
        const line = createFlexibleLineWithNetwork({
          operatorRef: 'TST:Operator:1',
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('validates using createFlexibleLineWithType factory', () => {
        const line = createFlexibleLineWithType(
          FlexibleLineType.CORRIDOR_SERVICE,
          {
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          },
        );
        expect(aboutFlexibleLineStepIsValid(line)).toBe(true);
      });

      it('returns false for empty flexible line', () => {
        const line = createEmptyFlexibleLine();
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });
    });

    describe('optionalPublicCode parameter', () => {
      it('allows empty publicCode when optionalPublicCode is true', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line, true)).toBe(true);
      });

      it('requires publicCode when optionalPublicCode is false', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line, false)).toBe(false);
      });

      it('defaults to requiring publicCode when optionalPublicCode is not specified', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        });
        expect(aboutFlexibleLineStepIsValid(line)).toBe(false);
      });
    });
  });

  describe('getMaxAllowedStepIndex', () => {
    describe('step 0: aboutLineStepIsValid check', () => {
      it('returns 0 when line name is blank', () => {
        const line = createLine({
          name: '',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
      });

      it('returns 0 when publicCode is blank and optionalPublicCode is false', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
        expect(getMaxAllowedStepIndex(line, mockIntl, false)).toBe(0);
      });

      it('allows empty publicCode when optionalPublicCode is true', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl, true)).toBe(3);
      });

      it('returns 0 when operatorRef is missing', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
      });

      it('returns 0 when networkRef is missing', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: '',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
      });

      it('returns 0 when transportMode is missing', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: null as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
      });

      it('returns 0 when transportSubmode is missing', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: undefined,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(0);
      });
    });

    describe('step 1: journey pattern validation', () => {
      it('returns 1 when journey pattern has blank name', () => {
        const jp = createJourneyPattern({ name: '' });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(1);
      });

      it('returns 1 when journey pattern has no stop points', () => {
        const jp = createJourneyPattern({ pointsInSequence: [] });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(1);
      });

      it('returns 1 when journey pattern has only 1 stop point', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [createFirstStopPoint()],
        });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(1);
      });

      it('returns 1 when any journey pattern is invalid (multiple patterns)', () => {
        const validJp = createJourneyPattern();
        const invalidJp = createJourneyPattern({ name: '' });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [validJp, invalidJp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(1);
      });

      it('returns 1 when first stop has invalid boarding settings', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(undefined, { forBoarding: false }),
            createLastStopPoint(),
          ],
        });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(1);
      });
    });

    describe('step 2: service journey validation', () => {
      it('returns 2 when service journey has no name', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(2);
      });

      it('returns 2 when service journey has no passing times', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: [],
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(2);
      });

      it('returns 2 when service journey has no day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(2);
      });

      it('returns 2 when any service journey is invalid in any pattern', () => {
        const jp1 = createJourneyPattern();
        jp1.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const jp2 = createJourneyPattern({ name: 'Second Pattern' });
        jp2.serviceJourneys = [
          createServiceJourney({
            name: '', // Invalid
            dayTypes: [createDayType()],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp1, jp2],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(2);
      });
    });

    describe('step 3: all validations pass', () => {
      it('returns 3 when all validations pass', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(3);
      });

      it('returns 3 with multiple valid journey patterns', () => {
        const jp1 = createJourneyPattern();
        jp1.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const jp2 = createJourneyPattern({ name: 'Return Route' });
        jp2.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: 'Evening',
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp1, jp2],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(3);
      });

      it('returns 3 with weekend day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [createWeekendDayType()],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Weekend Express',
          publicCode: 'W1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'expressBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedStepIndex(line, mockIntl)).toBe(3);
      });
    });
  });

  describe('getMaxAllowedFlexibleLineStepIndex', () => {
    describe('step 0: aboutFlexibleLineStepIsValid check', () => {
      it('returns 0 when flexible line name is blank', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(0);
      });

      it('returns 0 when flexibleLineType is missing', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(0);
      });

      it('returns 0 when publicCode is blank and optionalPublicCode is false', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(0);
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl, false)).toBe(
          0,
        );
      });

      it('allows empty publicCode when optionalPublicCode is true', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl, true)).toBe(
          3,
        );
      });
    });

    describe('step 1: flexible journey pattern validation', () => {
      it('returns 1 when journey pattern has blank name', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          name: '',
          pointsInSequence: stops,
        });
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(1);
      });

      it('returns 1 when flexible stop has no flexibleStopPlaceRef', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              flexibleStopPlaceRef: null,
              destinationDisplay: { frontText: 'Destination' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(1);
      });

      it('uses validJourneyPattern for non-FLEXIBLE_AREAS_ONLY types', () => {
        const jp = createJourneyPattern({ name: '' }); // Invalid due to blank name
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(1);
      });
    });

    describe('step 2: service journey validation', () => {
      it('returns 2 when service journey has no name', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(2);
      });

      it('returns 2 when service journey has no day types', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(2);
      });
    });

    describe('step 3: all validations pass', () => {
      it('returns 3 when all validations pass for FLEXIBLE_AREAS_ONLY', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(3);
      });

      it('returns 3 when all validations pass for CORRIDOR_SERVICE', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(getMaxAllowedFlexibleLineStepIndex(line, mockIntl)).toBe(3);
      });
    });
  });

  describe('currentStepIsValid', () => {
    describe('step 0: aboutLineStepIsValid', () => {
      it('returns true when line about step is valid', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(currentStepIsValid(0, line, mockIntl)).toBe(true);
      });

      it('returns false when line name is blank', () => {
        const line = createLine({
          name: '',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(currentStepIsValid(0, line, mockIntl)).toBe(false);
      });

      it('respects optionalPublicCode parameter', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(currentStepIsValid(0, line, mockIntl, false)).toBe(false);
        expect(currentStepIsValid(0, line, mockIntl, true)).toBe(true);
      });
    });

    describe('step 1: journey patterns validation', () => {
      it('returns true when all journey patterns are valid', () => {
        const jp1 = createJourneyPattern();
        const jp2 = createJourneyPattern({ name: 'Second Route' });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp1, jp2],
        });
        expect(currentStepIsValid(1, line, mockIntl)).toBe(true);
      });

      it('returns false when any journey pattern has blank name', () => {
        const jp1 = createJourneyPattern();
        const jp2 = createJourneyPattern({ name: '' });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp1, jp2],
        });
        expect(currentStepIsValid(1, line, mockIntl)).toBe(false);
      });

      it('returns false when journey pattern has insufficient stop points', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [createFirstStopPoint()],
        });
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(currentStepIsValid(1, line, mockIntl)).toBe(false);
      });
    });

    describe('step 2: service journeys validation', () => {
      it('returns true when all service journeys are valid', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(currentStepIsValid(2, line, mockIntl)).toBe(true);
      });

      it('returns false when service journey has blank name', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(currentStepIsValid(2, line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has no day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(currentStepIsValid(2, line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has invalid passing times', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: [
              createFirstStopPassingTime('10:00:00'),
              createLastStopPassingTime('09:00:00'), // Before first
            ],
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(currentStepIsValid(2, line, mockIntl)).toBe(false);
      });
    });

    describe('step 3: always valid', () => {
      it('returns true for step 3 regardless of line state', () => {
        const line = createEmptyLine();
        expect(currentStepIsValid(3, line, mockIntl)).toBe(true);
      });

      it('returns true for step 3 with fully valid line', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(currentStepIsValid(3, line, mockIntl)).toBe(true);
      });
    });

    describe('invalid step numbers', () => {
      it('returns false for negative step numbers', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(currentStepIsValid(-1, line, mockIntl)).toBe(false);
      });

      it('returns false for step numbers greater than 3', () => {
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [createJourneyPattern()],
        });
        expect(currentStepIsValid(4, line, mockIntl)).toBe(false);
        expect(currentStepIsValid(100, line, mockIntl)).toBe(false);
      });
    });
  });

  describe('currentFlexibleLineStepIsValid', () => {
    describe('step 0: aboutFlexibleLineStepIsValid', () => {
      it('returns true when flexible line about step is valid', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl)).toBe(true);
      });

      it('returns false when flexible line name is blank', () => {
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl)).toBe(false);
      });

      it('returns false when flexibleLineType is missing', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl)).toBe(false);
      });

      it('respects optionalPublicCode parameter', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl, false)).toBe(
          false,
        );
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl, true)).toBe(
          true,
        );
      });
    });

    describe('step 1: flexible journey patterns validation', () => {
      it('returns true when all flexible journey patterns are valid', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(true);
      });

      it('returns false when journey pattern has blank name', () => {
        // Create valid flexible stops with frontText on first stop but blank name
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          name: '',
          pointsInSequence: stops,
        });
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(false);
      });

      it('validates using flexible validation for FLEXIBLE_AREAS_ONLY type', () => {
        // Flexible areas only requires flexibleStopPlaceRef on all stops
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              flexibleStopPlaceRef: null, // Invalid for flexible areas
              destinationDisplay: { frontText: 'Dest' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(false);
      });

      it('validates using standard validation for non-FLEXIBLE_AREAS_ONLY types', () => {
        const jp = createJourneyPattern(); // Standard journey pattern
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(true);
      });
    });

    describe('step 2: service journeys validation', () => {
      it('returns true when all service journeys are valid', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(2, line, mockIntl)).toBe(true);
      });

      it('returns false when service journey has blank name', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(2, line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has no day types', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(2, line, mockIntl)).toBe(false);
      });
    });

    describe('step 3: always valid', () => {
      it('returns true for step 3 regardless of line state', () => {
        const line = createEmptyFlexibleLine();
        expect(currentFlexibleLineStepIsValid(3, line, mockIntl)).toBe(true);
      });

      it('returns true for step 3 with fully valid flexible line', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(3, line, mockIntl)).toBe(true);
      });
    });

    describe('invalid step numbers', () => {
      it('returns false for negative step numbers', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(currentFlexibleLineStepIsValid(-1, line, mockIntl)).toBe(false);
      });

      it('returns false for step numbers greater than 3', () => {
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [createFlexibleJourneyPattern(2)],
        });
        expect(currentFlexibleLineStepIsValid(4, line, mockIntl)).toBe(false);
        expect(currentFlexibleLineStepIsValid(100, line, mockIntl)).toBe(false);
      });
    });

    describe('different flexible line types', () => {
      it('validates CORRIDOR_SERVICE correctly', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl)).toBe(true);
        expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(true);
        expect(currentFlexibleLineStepIsValid(2, line, mockIntl)).toBe(true);
        expect(currentFlexibleLineStepIsValid(3, line, mockIntl)).toBe(true);
      });

      it('validates MIXED_FLEXIBLE correctly', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Mixed',
          publicCode: 'MIX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE,
          journeyPatterns: [jp],
        });
        expect(currentFlexibleLineStepIsValid(0, line, mockIntl)).toBe(true);
        expect(currentFlexibleLineStepIsValid(1, line, mockIntl)).toBe(true);
        expect(currentFlexibleLineStepIsValid(2, line, mockIntl)).toBe(true);
      });
    });
  });

  // ==========================================================================
  // Phase 11: Top-Level Validators (Integration Tests)
  // ==========================================================================

  describe('validLine (integration tests)', () => {
    describe('returns true for fully valid lines', () => {
      it('returns true for minimal valid line', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(true);
      });

      it('returns true for line with multiple journey patterns', () => {
        const jp1 = createJourneyPattern({ name: 'Outbound' });
        jp1.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: 'Morning',
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        const jp2 = createJourneyPattern({ name: 'Return' });
        jp2.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: 'Evening',
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        const line = createLine({
          name: 'Express Route',
          publicCode: 'EX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'expressBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp1, jp2],
        });
        expect(validLine(line, mockIntl)).toBe(true);
      });

      it('returns true for line with multiple service journeys per pattern', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: 'Morning',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Afternoon',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: 'Evening',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'City Loop',
          publicCode: 'CL',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(true);
      });

      it('returns true for line with weekend day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [createWeekendDayType()],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Weekend Express',
          publicCode: 'WE',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'expressBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(true);
      });

      it('returns true for line with many stop points', () => {
        const jp = createJourneyPattern({
          pointsInSequence: createStopPointSequence(10),
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(10),
          }),
        ];
        const line = createLine({
          name: 'Long Route',
          publicCode: 'LR',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(true);
      });

      it('returns true for line with different transport modes', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const tramLine = createLine({
          name: 'Tram Line',
          publicCode: 'T1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.TRAM,
          transportSubmode: 'localTram' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(tramLine, mockIntl)).toBe(true);

        const railLine = createLine({
          name: 'Rail Line',
          publicCode: 'R1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.RAIL,
          transportSubmode: 'local' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(railLine, mockIntl)).toBe(true);
      });
    });

    describe('returns false when aboutLineStepIsValid fails', () => {
      it('returns false when line name is blank', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: '',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when publicCode is blank (default)', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when operatorRef is missing', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when networkRef is missing', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: '',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when transportMode is null', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: null as any,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when transportSubmode is missing', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: undefined,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });
    });

    describe('returns false when journey pattern validation fails', () => {
      it('returns false when journey pattern has blank name', () => {
        const jp = createJourneyPattern({ name: '' });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when journey pattern has no stop points', () => {
        const jp = createJourneyPattern({ pointsInSequence: [] });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when journey pattern has only one stop point', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [createFirstStopPoint()],
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(1),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when first stop point has invalid boarding settings', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFirstStopPoint(undefined, { forBoarding: false }),
            createLastStopPoint(),
          ],
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when any journey pattern is invalid (multiple patterns)', () => {
        const validJp = createJourneyPattern({ name: 'Valid Pattern' });
        validJp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const invalidJp = createJourneyPattern({ name: '' });
        invalidJp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [validJp, invalidJp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });
    });

    describe('returns false when service journey validation fails', () => {
      it('returns false when service journey has blank name', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has no passing times', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: [],
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has no day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has invalid passing times ordering', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: [
              createFirstStopPassingTime('10:00:00'),
              createLastStopPassingTime('09:00:00'), // Before first
            ],
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('returns false when any service journey is invalid (multiple journeys)', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: 'Valid Journey',
            passingTimes: createPassingTimeSequence(2),
          }),
          createServiceJourneyWithDayTypes({
            name: '', // Invalid
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });
    });

    describe('optionalPublicCode parameter', () => {
      it('allows empty publicCode when optionalPublicCode is true', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl, true)).toBe(true);
      });

      it('requires publicCode when optionalPublicCode is false', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl, false)).toBe(false);
      });

      it('defaults to requiring publicCode when optionalPublicCode is not specified', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: 'Test Line',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('returns false for empty line', () => {
        const line = createEmptyLine();
        expect(validLine(line, mockIntl)).toBe(false);
      });

      it('throws when journeyPatterns is undefined (direct object construction)', () => {
        // Note: createLine factory skips undefined values during deep merge,
        // so we need to construct the line object directly to test this edge case
        const line = {
          id: 'test-line-id',
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: undefined,
        } as any;
        // The function accesses journeyPatterns! with non-null assertion,
        // so calling .every() on undefined will throw
        expect(() => validLine(line, mockIntl)).toThrow();
      });

      it('returns true when journeyPatterns is empty array', () => {
        // Empty array means every()/every passes vacuously
        const line = createLine({
          name: 'Test Line',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [],
        });
        expect(validLine(line, mockIntl)).toBe(true);
      });

      it('handles line with whitespace-only name', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createLine({
          name: '   ',
          publicCode: '42',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          journeyPatterns: [jp],
        });
        expect(validLine(line, mockIntl)).toBe(false);
      });
    });
  });

  describe('validFlexibleLine (integration tests)', () => {
    describe('returns true for fully valid flexible lines', () => {
      it('returns true for minimal valid FLEXIBLE_AREAS_ONLY line', () => {
        // Create valid flexible stops with frontText on first stop
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Flex Service',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('returns true for valid CORRIDOR_SERVICE line', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Corridor Service',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('returns true for valid MIXED_FLEXIBLE line', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Mixed Flexible',
          publicCode: 'MIX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('returns true for valid HAIL_AND_RIDE_SECTIONS line', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Hail and Ride',
          publicCode: 'HR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('returns true for valid FIXED_STOP_AREA_WIDE line', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Fixed Stop Area',
          publicCode: 'FSA1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FIXED_STOP_AREA_WIDE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('returns true for flexible line with multiple journey patterns', () => {
        const jp1 = createJourneyPattern({ name: 'Route A' });
        jp1.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const jp2 = createJourneyPattern({ name: 'Route B' });
        jp2.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(3),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Multi-Route Flex',
          publicCode: 'MRF1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp1, jp2],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('returns true for flexible line with weekend day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [createWeekendDayType()],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Weekend Flex',
          publicCode: 'WF1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });
    });

    describe('returns false when aboutFlexibleLineStepIsValid fails', () => {
      it('returns false when line name is blank', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: '',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when flexibleLineType is missing', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: null as any,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when operatorRef is missing', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: '',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when publicCode is blank (default)', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });
    });

    describe('returns false when FLEXIBLE_AREAS_ONLY journey pattern validation fails', () => {
      it('returns false when journey pattern has blank name', () => {
        const stops = createFlexibleStopPointSequence(2);
        stops[0] = {
          ...stops[0],
          destinationDisplay: { frontText: 'Destination' },
        };
        const jp = createJourneyPattern({
          name: '',
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when flexible stop has no flexibleStopPlaceRef', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [
            createFlexibleStopPoint({
              flexibleStopPlaceRef: null,
              destinationDisplay: { frontText: 'Destination' },
            }),
            createFlexibleStopPoint(),
          ],
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when first flexible stop has no frontText', () => {
        const stops = createFlexibleStopPointSequence(2);
        // First stop has no frontText
        const jp = createJourneyPattern({
          pointsInSequence: stops,
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Flexible',
          publicCode: 'FLEX1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });
    });

    describe('returns false when non-FLEXIBLE_AREAS_ONLY journey pattern validation fails', () => {
      it('returns false when journey pattern has blank name', () => {
        const jp = createJourneyPattern({ name: '' });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when journey pattern has no stop points', () => {
        const jp = createJourneyPattern({ pointsInSequence: [] });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when journey pattern has only one stop point', () => {
        const jp = createJourneyPattern({
          pointsInSequence: [createFirstStopPoint()],
        });
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(1),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });
    });

    describe('returns false when service journey validation fails', () => {
      it('returns false when service journey has blank name', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            name: '',
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has no day types', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourney({
            dayTypes: [],
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns false when service journey has invalid passing times', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: [
              createFirstStopPassingTime('10:00:00'),
              createLastStopPassingTime('09:00:00'), // Before first
            ],
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });
    });

    describe('optionalPublicCode parameter', () => {
      it('allows empty publicCode when optionalPublicCode is true', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl, true)).toBe(true);
      });

      it('requires publicCode when optionalPublicCode is false', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: '',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl, false)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('returns false for empty flexible line', () => {
        const line = createEmptyFlexibleLine();
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });

      it('returns true when journeyPatterns is empty array', () => {
        // Empty array means every() passes vacuously
        const line = createFlexibleLine({
          name: 'Test Corridor',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(true);
      });

      it('handles flexible line with whitespace-only name', () => {
        const jp = createJourneyPattern();
        jp.serviceJourneys = [
          createServiceJourneyWithDayTypes({
            passingTimes: createPassingTimeSequence(2),
          }),
        ];
        const line = createFlexibleLine({
          name: '   ',
          publicCode: 'CORR1',
          operatorRef: 'TST:Operator:1',
          networkRef: 'TST:Network:1',
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: 'localBus' as VEHICLE_SUBMODE,
          flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
          journeyPatterns: [jp],
        });
        expect(validFlexibleLine(line, mockIntl)).toBe(false);
      });
    });

    describe('all FlexibleLineType values', () => {
      // Test that all FlexibleLineType values work correctly
      const flexibleLineTypes = [
        FlexibleLineType.FLEXIBLE_AREAS_ONLY,
        FlexibleLineType.CORRIDOR_SERVICE,
        FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
        FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
        FlexibleLineType.MIXED_FLEXIBLE,
        FlexibleLineType.FIXED_STOP_AREA_WIDE,
        FlexibleLineType.MIXED_FLEXIBLE_AND_FIXED,
        FlexibleLineType.FIXED,
      ];

      flexibleLineTypes.forEach((type) => {
        it(`validates ${type} type correctly`, () => {
          let jp;
          if (type === FlexibleLineType.FLEXIBLE_AREAS_ONLY) {
            // FLEXIBLE_AREAS_ONLY requires flexible stops with frontText
            const stops = createFlexibleStopPointSequence(2);
            stops[0] = {
              ...stops[0],
              destinationDisplay: { frontText: 'Destination' },
            };
            jp = createJourneyPattern({
              pointsInSequence: stops,
            });
          } else {
            // Other types use standard journey patterns
            jp = createJourneyPattern();
          }
          jp.serviceJourneys = [
            createServiceJourneyWithDayTypes({
              passingTimes: createPassingTimeSequence(2),
            }),
          ];
          const line = createFlexibleLine({
            name: `Test ${type}`,
            publicCode: 'TEST1',
            operatorRef: 'TST:Operator:1',
            networkRef: 'TST:Network:1',
            transportMode: VEHICLE_MODE.BUS,
            transportSubmode: 'localBus' as VEHICLE_SUBMODE,
            flexibleLineType: type,
            journeyPatterns: [jp],
          });
          expect(validFlexibleLine(line, mockIntl)).toBe(true);
        });
      });
    });
  });
});
