import { describe, it, expect, beforeEach } from 'vitest';
import { stopPointToPayload, flexibleStopPointToPayload } from './StopPoint';
import {
  createQuayStopPoint,
  createFlexibleStopPoint,
  createFlexibleStopPlace,
  createBookingArrangement,
  resetIdCounters,
} from 'test/factories';

describe('stopPointToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('property removal', () => {
    it('removes flexibleStopPlace property', () => {
      const stopPoint = createFlexibleStopPoint();

      const result = stopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('flexibleStopPlace');
    });

    it('removes key property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1');

      const result = stopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('key');
    });

    it('removes both flexibleStopPlace and key', () => {
      const stopPoint = createFlexibleStopPoint();

      const result = stopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('flexibleStopPlace');
      expect(result).not.toHaveProperty('key');
    });
  });

  describe('property passthrough', () => {
    it('preserves id property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        id: 'TST:StopPointInJourneyPattern:1',
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.id).toBe('TST:StopPointInJourneyPattern:1');
    });

    it('preserves quayRef property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:123');

      const result = stopPointToPayload(stopPoint);

      expect(result.quayRef).toBe('TST:Quay:123');
    });

    it('preserves flexibleStopPlaceRef property', () => {
      const stopPoint = createFlexibleStopPoint({
        flexibleStopPlaceRef: 'TST:FlexibleStopPlace:1',
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBe('TST:FlexibleStopPlace:1');
    });

    it('preserves destinationDisplay property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        destinationDisplay: { frontText: 'Downtown' },
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.destinationDisplay).toEqual({ frontText: 'Downtown' });
    });

    it('preserves forBoarding property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        forBoarding: true,
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.forBoarding).toBe(true);
    });

    it('preserves forAlighting property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        forAlighting: false,
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.forAlighting).toBe(false);
    });

    it('preserves bookingArrangement property', () => {
      const booking = createBookingArrangement();
      const stopPoint = createFlexibleStopPoint({
        bookingArrangement: booking,
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.bookingArrangement).toEqual(booking);
    });

    it('preserves notices property', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        notices: [{ text: 'Notice 1' }, { text: 'Notice 2' }],
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.notices).toEqual([
        { text: 'Notice 1' },
        { text: 'Notice 2' },
      ]);
    });

    it('preserves null values for optional properties', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        flexibleStopPlaceRef: null,
        destinationDisplay: null,
        forBoarding: null,
        forAlighting: null,
        bookingArrangement: null,
      });

      const result = stopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBeNull();
      expect(result.destinationDisplay).toBeNull();
      expect(result.forBoarding).toBeNull();
      expect(result.forAlighting).toBeNull();
      expect(result.bookingArrangement).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles stop point with only required properties', () => {
      const stopPoint: any = {
        id: 'TST:StopPointInJourneyPattern:1',
        key: 'abc123',
        quayRef: 'TST:Quay:1',
      };

      const result = stopPointToPayload(stopPoint);

      expect(result.id).toBe('TST:StopPointInJourneyPattern:1');
      expect(result.quayRef).toBe('TST:Quay:1');
      expect(result).not.toHaveProperty('key');
    });

    it('handles stop point with undefined flexibleStopPlace', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        flexibleStopPlace: undefined,
      });

      const result = stopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('flexibleStopPlace');
    });

    it('handles stop point with all properties', () => {
      const booking = createBookingArrangement();
      const flexibleStopPlace = createFlexibleStopPlace();
      const stopPoint = {
        id: 'TST:StopPointInJourneyPattern:1',
        key: 'abc123def456',
        quayRef: null,
        flexibleStopPlace,
        flexibleStopPlaceRef: flexibleStopPlace.id,
        destinationDisplay: { frontText: 'Terminus' },
        forBoarding: true,
        forAlighting: true,
        bookingArrangement: booking,
        notices: [{ text: 'Accessible' }],
      };

      const result = stopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('flexibleStopPlace');
      expect(result).not.toHaveProperty('key');
      expect(result.id).toBe('TST:StopPointInJourneyPattern:1');
      expect(result.quayRef).toBeNull();
      expect(result.flexibleStopPlaceRef).toBe(flexibleStopPlace.id);
      expect(result.destinationDisplay).toEqual({ frontText: 'Terminus' });
      expect(result.forBoarding).toBe(true);
      expect(result.forAlighting).toBe(true);
      expect(result.bookingArrangement).toEqual(booking);
      expect(result.notices).toEqual([{ text: 'Accessible' }]);
    });
  });
});

describe('flexibleStopPointToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('property removal', () => {
    it('removes flexibleStopPlace property', () => {
      const stopPoint = createFlexibleStopPoint();

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('flexibleStopPlace');
    });

    it('removes key property', () => {
      const stopPoint = createFlexibleStopPoint();

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('key');
    });
  });

  describe('null ref injection', () => {
    it('adds null flexibleStopPlaceRef when missing', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1');
      delete (stopPoint as Record<string, unknown>)['flexibleStopPlaceRef'];

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBeNull();
    });

    it('adds null quayRef when missing', () => {
      const stopPoint = createFlexibleStopPoint();
      delete (stopPoint as Record<string, unknown>)['quayRef'];

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.quayRef).toBeNull();
    });

    it('adds both null refs when both are missing', () => {
      const stopPoint: any = {
        id: 'TST:StopPointInJourneyPattern:1',
        key: 'abc123',
        flexibleStopPlace: createFlexibleStopPlace(),
      };

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBeNull();
      expect(result.quayRef).toBeNull();
    });

    it('preserves existing flexibleStopPlaceRef when present', () => {
      const stopPoint = createFlexibleStopPoint({
        flexibleStopPlaceRef: 'TST:FlexibleStopPlace:existing',
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBe(
        'TST:FlexibleStopPlace:existing',
      );
    });

    it('preserves existing quayRef when present', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:existing');

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.quayRef).toBe('TST:Quay:existing');
    });

    it('preserves null flexibleStopPlaceRef when explicitly null', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1', {
        flexibleStopPlaceRef: null,
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBeNull();
    });

    it('preserves null quayRef when explicitly null', () => {
      const stopPoint = createFlexibleStopPoint({
        quayRef: null,
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.quayRef).toBeNull();
    });
  });

  describe('property passthrough', () => {
    it('preserves id property', () => {
      const stopPoint = createFlexibleStopPoint({
        id: 'TST:StopPointInJourneyPattern:1',
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.id).toBe('TST:StopPointInJourneyPattern:1');
    });

    it('preserves destinationDisplay property', () => {
      const stopPoint = createFlexibleStopPoint({
        destinationDisplay: { frontText: 'Flex Zone' },
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.destinationDisplay).toEqual({ frontText: 'Flex Zone' });
    });

    it('preserves forBoarding property', () => {
      const stopPoint = createFlexibleStopPoint({
        forBoarding: true,
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.forBoarding).toBe(true);
    });

    it('preserves forAlighting property', () => {
      const stopPoint = createFlexibleStopPoint({
        forAlighting: false,
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.forAlighting).toBe(false);
    });

    it('preserves bookingArrangement property', () => {
      const booking = createBookingArrangement();
      const stopPoint = createFlexibleStopPoint({
        bookingArrangement: booking,
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.bookingArrangement).toEqual(booking);
    });

    it('preserves notices property', () => {
      const stopPoint = createFlexibleStopPoint({
        notices: [{ text: 'Flexible service' }],
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.notices).toEqual([{ text: 'Flexible service' }]);
    });
  });

  describe('stop point type switching scenarios', () => {
    it('handles switching from quay to flexible (adds null flexibleStopPlaceRef)', () => {
      // Simulates a stop point that was "external" (quay-based) being switched
      const stopPoint = createQuayStopPoint('TST:Quay:1');
      delete (stopPoint as Record<string, unknown>)['flexibleStopPlaceRef'];

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.quayRef).toBe('TST:Quay:1');
      expect(result.flexibleStopPlaceRef).toBeNull();
    });

    it('handles switching from flexible to quay (adds null quayRef)', () => {
      // Simulates a stop point that was "flexible" being switched to "external"
      const stopPoint = createFlexibleStopPoint();
      delete (stopPoint as Record<string, unknown>)['quayRef'];

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.flexibleStopPlaceRef).toBeDefined();
      expect(result.quayRef).toBeNull();
    });

    it('handles mixed stop point with both refs', () => {
      // Edge case: stop point with both refs set (shouldn't happen in practice)
      const stopPoint = createFlexibleStopPoint({
        quayRef: 'TST:Quay:mixed',
        flexibleStopPlaceRef: 'TST:FlexibleStopPlace:mixed',
      });

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.quayRef).toBe('TST:Quay:mixed');
      expect(result.flexibleStopPlaceRef).toBe('TST:FlexibleStopPlace:mixed');
    });
  });

  describe('edge cases', () => {
    it('handles stop point with only required properties', () => {
      const stopPoint: any = {
        id: 'TST:StopPointInJourneyPattern:1',
        key: 'abc123',
      };

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result.id).toBe('TST:StopPointInJourneyPattern:1');
      expect(result).not.toHaveProperty('key');
      expect(result.flexibleStopPlaceRef).toBeNull();
      expect(result.quayRef).toBeNull();
    });

    it('handles stop point with all properties', () => {
      const booking = createBookingArrangement();
      const flexibleStopPlace = createFlexibleStopPlace();
      const stopPoint = {
        id: 'TST:StopPointInJourneyPattern:1',
        key: 'abc123def456',
        quayRef: null,
        flexibleStopPlace,
        flexibleStopPlaceRef: flexibleStopPlace.id,
        destinationDisplay: { frontText: 'Flex Terminus' },
        forBoarding: true,
        forAlighting: true,
        bookingArrangement: booking,
        notices: [{ text: 'Book ahead' }],
      };

      const result = flexibleStopPointToPayload(stopPoint);

      expect(result).not.toHaveProperty('flexibleStopPlace');
      expect(result).not.toHaveProperty('key');
      expect(result.id).toBe('TST:StopPointInJourneyPattern:1');
      expect(result.quayRef).toBeNull();
      expect(result.flexibleStopPlaceRef).toBe(flexibleStopPlace.id);
      expect(result.destinationDisplay).toEqual({ frontText: 'Flex Terminus' });
      expect(result.forBoarding).toBe(true);
      expect(result.forAlighting).toBe(true);
      expect(result.bookingArrangement).toEqual(booking);
      expect(result.notices).toEqual([{ text: 'Book ahead' }]);
    });
  });
});

describe('stopPointToPayload vs flexibleStopPointToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  it('stopPointToPayload does not add null refs', () => {
    const stopPoint: any = {
      id: 'TST:StopPointInJourneyPattern:1',
      key: 'abc123',
    };

    const result = stopPointToPayload(stopPoint);

    expect(result).not.toHaveProperty('flexibleStopPlaceRef');
    expect(result).not.toHaveProperty('quayRef');
  });

  it('flexibleStopPointToPayload adds null refs when missing', () => {
    const stopPoint: any = {
      id: 'TST:StopPointInJourneyPattern:1',
      key: 'abc123',
    };

    const result = flexibleStopPointToPayload(stopPoint);

    expect(result.flexibleStopPlaceRef).toBeNull();
    expect(result.quayRef).toBeNull();
  });

  it('both remove flexibleStopPlace and key properties', () => {
    const flexibleStopPlace = createFlexibleStopPlace();
    const stopPoint = {
      id: 'TST:StopPointInJourneyPattern:1',
      key: 'abc123',
      flexibleStopPlace,
      quayRef: 'TST:Quay:1',
      flexibleStopPlaceRef: 'TST:FlexibleStopPlace:1',
    };

    const regularResult = stopPointToPayload(stopPoint);
    const flexibleResult = flexibleStopPointToPayload(stopPoint);

    // Both should remove these properties
    expect(regularResult).not.toHaveProperty('flexibleStopPlace');
    expect(regularResult).not.toHaveProperty('key');
    expect(flexibleResult).not.toHaveProperty('flexibleStopPlace');
    expect(flexibleResult).not.toHaveProperty('key');

    // Both should preserve other properties
    expect(regularResult.id).toBe('TST:StopPointInJourneyPattern:1');
    expect(flexibleResult.id).toBe('TST:StopPointInJourneyPattern:1');
    expect(regularResult.quayRef).toBe('TST:Quay:1');
    expect(flexibleResult.quayRef).toBe('TST:Quay:1');
  });
});
