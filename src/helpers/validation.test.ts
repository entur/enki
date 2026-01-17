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

  // Test groups will be added in subsequent phases
  describe('placeholder', () => {
    it('should pass', () => {
      expect(true).toBe(true);
    });
  });
});
