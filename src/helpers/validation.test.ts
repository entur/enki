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
} from 'test/factories';
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
});
