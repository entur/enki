import { describe, it, expect, beforeEach } from 'vitest';
import { IntlShape } from 'react-intl';
import { resetIdCounters, createTime, createDate } from 'test/factories';
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
});
