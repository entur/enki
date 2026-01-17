import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetIdCounters,
  createQuayStopPoint,
  createFlexibleStopPoint,
  createFirstStopPoint,
  createLastStopPoint,
  createStopPointSequence,
  createFlexibleStopPointSequence,
} from 'test/factories';
import {
  validateStopPoint,
  validateFlexibleAreasOnlyStopPoint,
  getStopPointsErrors,
  validateStopPoints,
  validateFlexibleAreasOnlyStopPoints,
} from './stopPoint';

describe('stopPoint validation', () => {
  beforeEach(() => {
    resetIdCounters();
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
