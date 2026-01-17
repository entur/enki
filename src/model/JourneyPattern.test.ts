import { describe, it, expect, beforeEach } from 'vitest';
import { journeyPatternToPayload } from './JourneyPattern';
import {
  createJourneyPattern,
  createJourneyPatternWithStops,
  createFlexibleJourneyPattern,
  createJourneyPatternWithNotices,
  createEmptyJourneyPattern,
  createServiceJourney,
  createServiceJourneyWithPassingTimes,
  createQuayStopPoint,
  createFlexibleStopPoint,
  createStopPointSequence,
  createFlexibleStopPointSequence,
  resetIdCounters,
} from 'test/factories';
import { DIRECTION_TYPE } from './enums';

describe('journeyPatternToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('service journey transformation', () => {
    it('transforms service journeys using serviceJourneyToPayload', () => {
      const jp = createJourneyPatternWithStops(3, 1);

      const result = journeyPatternToPayload(jp);

      expect(result.serviceJourneys).toHaveLength(1);
      // Verify passing times were transformed
      expect(result.serviceJourneys[0].passingTimes).toHaveLength(3);
    });

    it('transforms multiple service journeys', () => {
      const jp = createJourneyPatternWithStops(3, 3);

      const result = journeyPatternToPayload(jp);

      expect(result.serviceJourneys).toHaveLength(3);
      result.serviceJourneys.forEach((sj: { passingTimes: unknown[] }) => {
        expect(sj.passingTimes).toHaveLength(3);
      });
    });

    it('handles empty service journeys array', () => {
      const jp = createJourneyPattern({
        serviceJourneys: [],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.serviceJourneys).toEqual([]);
    });

    it('removes new_ prefixed IDs from service journeys', () => {
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourney({
            id: 'new_ServiceJourney_1',
            passingTimes: [],
          }),
        ],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.serviceJourneys[0].id).toBeUndefined();
    });

    it('preserves valid service journey IDs', () => {
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourney({
            id: 'TST:ServiceJourney:1',
            passingTimes: [],
          }),
        ],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.serviceJourneys[0].id).toBe('TST:ServiceJourney:1');
    });
  });

  describe('points in sequence transformation (regular stops)', () => {
    it('transforms stop points using stopPointToPayload when not flexible', () => {
      const jp = createJourneyPatternWithStops(3);

      const result = journeyPatternToPayload(jp, false);

      expect(result.pointsInSequence).toHaveLength(3);
      // stopPointToPayload removes flexibleStopPlace and key
      result.pointsInSequence.forEach((stop: Record<string, unknown>) => {
        expect(stop).not.toHaveProperty('flexibleStopPlace');
        expect(stop).not.toHaveProperty('key');
      });
    });

    it('preserves quayRef for regular stop points', () => {
      const jp = createJourneyPattern({
        pointsInSequence: [
          createQuayStopPoint('TST:Quay:1'),
          createQuayStopPoint('TST:Quay:2'),
          createQuayStopPoint('TST:Quay:3'),
        ],
      });

      const result = journeyPatternToPayload(jp, false);

      expect(result.pointsInSequence[0].quayRef).toBe('TST:Quay:1');
      expect(result.pointsInSequence[1].quayRef).toBe('TST:Quay:2');
      expect(result.pointsInSequence[2].quayRef).toBe('TST:Quay:3');
    });

    it('preserves forBoarding and forAlighting properties', () => {
      const jp = createJourneyPattern({
        pointsInSequence: [
          createQuayStopPoint('TST:Quay:1', {
            forBoarding: true,
            forAlighting: false,
          }),
          createQuayStopPoint('TST:Quay:2', {
            forBoarding: true,
            forAlighting: true,
          }),
          createQuayStopPoint('TST:Quay:3', {
            forBoarding: false,
            forAlighting: true,
          }),
        ],
      });

      const result = journeyPatternToPayload(jp, false);

      expect(result.pointsInSequence[0].forBoarding).toBe(true);
      expect(result.pointsInSequence[0].forAlighting).toBe(false);
      expect(result.pointsInSequence[1].forBoarding).toBe(true);
      expect(result.pointsInSequence[1].forAlighting).toBe(true);
      expect(result.pointsInSequence[2].forBoarding).toBe(false);
      expect(result.pointsInSequence[2].forAlighting).toBe(true);
    });

    it('handles empty points in sequence', () => {
      const jp = createEmptyJourneyPattern();

      const result = journeyPatternToPayload(jp, false);

      expect(result.pointsInSequence).toEqual([]);
    });
  });

  describe('points in sequence transformation (flexible stops)', () => {
    it('transforms stop points using flexibleStopPointToPayload when flexible', () => {
      const jp = createFlexibleJourneyPattern(3);

      const result = journeyPatternToPayload(jp, true);

      expect(result.pointsInSequence).toHaveLength(3);
      // flexibleStopPointToPayload removes flexibleStopPlace and key
      result.pointsInSequence.forEach((stop: Record<string, unknown>) => {
        expect(stop).not.toHaveProperty('flexibleStopPlace');
        expect(stop).not.toHaveProperty('key');
      });
    });

    it('ensures flexibleStopPlaceRef is present when flexible', () => {
      const jp = createJourneyPattern({
        pointsInSequence: [
          createFlexibleStopPoint({
            flexibleStopPlaceRef: 'TST:FlexibleStopPlace:1',
          }),
        ],
      });

      const result = journeyPatternToPayload(jp, true);

      expect(result.pointsInSequence[0].flexibleStopPlaceRef).toBe(
        'TST:FlexibleStopPlace:1',
      );
    });

    it('adds null flexibleStopPlaceRef when missing in flexible mode', () => {
      // Create a stop point without flexibleStopPlaceRef
      const stopPoint = createQuayStopPoint('TST:Quay:1');
      delete (stopPoint as Record<string, unknown>)['flexibleStopPlaceRef'];

      const jp = createJourneyPattern({
        pointsInSequence: [stopPoint],
      });

      const result = journeyPatternToPayload(jp, true);

      // flexibleStopPointToPayload adds null for missing flexibleStopPlaceRef
      expect(result.pointsInSequence[0].flexibleStopPlaceRef).toBeNull();
    });

    it('adds null quayRef when missing in flexible mode', () => {
      const stopPoint = createFlexibleStopPoint();
      delete (stopPoint as Record<string, unknown>)['quayRef'];

      const jp = createJourneyPattern({
        pointsInSequence: [stopPoint],
      });

      const result = journeyPatternToPayload(jp, true);

      // flexibleStopPointToPayload adds null for missing quayRef
      expect(result.pointsInSequence[0].quayRef).toBeNull();
    });
  });

  describe('isFlexible flag propagation', () => {
    it('uses stopPointToPayload when isFlexible is false', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1');
      delete (stopPoint as Record<string, unknown>)['flexibleStopPlaceRef'];
      delete (stopPoint as Record<string, unknown>)['quayRef'];

      const jp = createJourneyPattern({
        pointsInSequence: [stopPoint],
      });

      const result = journeyPatternToPayload(jp, false);

      // stopPointToPayload does NOT add null refs
      expect(result.pointsInSequence[0]).not.toHaveProperty(
        'flexibleStopPlaceRef',
      );
      expect(result.pointsInSequence[0]).not.toHaveProperty('quayRef');
    });

    it('uses flexibleStopPointToPayload when isFlexible is true', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1');
      delete (stopPoint as Record<string, unknown>)['flexibleStopPlaceRef'];
      delete (stopPoint as Record<string, unknown>)['quayRef'];

      const jp = createJourneyPattern({
        pointsInSequence: [stopPoint],
      });

      const result = journeyPatternToPayload(jp, true);

      // flexibleStopPointToPayload adds null refs
      expect(result.pointsInSequence[0].flexibleStopPlaceRef).toBeNull();
      expect(result.pointsInSequence[0].quayRef).toBeNull();
    });

    it('defaults to non-flexible when isFlexible is not provided', () => {
      const stopPoint = createQuayStopPoint('TST:Quay:1');
      delete (stopPoint as Record<string, unknown>)['flexibleStopPlaceRef'];
      delete (stopPoint as Record<string, unknown>)['quayRef'];

      const jp = createJourneyPattern({
        pointsInSequence: [stopPoint],
      });

      // Call without isFlexible parameter (defaults to false)
      const result = journeyPatternToPayload(jp);

      // Should behave like isFlexible = false
      expect(result.pointsInSequence[0]).not.toHaveProperty(
        'flexibleStopPlaceRef',
      );
      expect(result.pointsInSequence[0]).not.toHaveProperty('quayRef');
    });
  });

  describe('notices filtering', () => {
    it('preserves notices with valid text', () => {
      const jp = createJourneyPatternWithNotices([
        { text: 'Valid notice 1' },
        { text: 'Valid notice 2' },
      ]);

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toEqual([
        { text: 'Valid notice 1' },
        { text: 'Valid notice 2' },
      ]);
    });

    it('filters out notices with empty text', () => {
      const jp = createJourneyPatternWithNotices([
        { text: 'Valid notice' },
        { text: '' },
        { text: 'Another valid' },
      ]);

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });

    it('filters out notices without text property', () => {
      const jp = createJourneyPattern({
        notices: [
          { text: 'Valid notice' },
          {} as any,
          { text: 'Another valid' },
        ],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });

    it('filters out null/undefined notices', () => {
      const jp = createJourneyPattern({
        notices: [{ text: 'Valid notice' }, null as any, undefined as any],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toEqual([{ text: 'Valid notice' }]);
    });

    it('returns empty array when all notices are invalid', () => {
      const jp = createJourneyPattern({
        notices: [{ text: '' }, {} as any, null as any],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toEqual([]);
    });

    it('returns undefined when notices is undefined', () => {
      const jp = createJourneyPattern();
      delete (jp as Record<string, unknown>).notices;

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toBeUndefined();
    });

    it('returns undefined when notices is null', () => {
      const jp = createJourneyPattern({
        notices: null,
      });

      const result = journeyPatternToPayload(jp);

      expect(result.notices).toBeUndefined();
    });
  });

  describe('property passthrough', () => {
    it('preserves id property', () => {
      const jp = createJourneyPattern({
        id: 'TST:JourneyPattern:1',
      });

      const result = journeyPatternToPayload(jp);

      expect(result.id).toBe('TST:JourneyPattern:1');
    });

    it('preserves name property', () => {
      const jp = createJourneyPattern({
        name: 'Express Route',
      });

      const result = journeyPatternToPayload(jp);

      expect(result.name).toBe('Express Route');
    });

    it('preserves description property', () => {
      const jp = createJourneyPattern({
        description: 'A test journey pattern',
      });

      const result = journeyPatternToPayload(jp);

      expect(result.description).toBe('A test journey pattern');
    });

    it('preserves privateCode property', () => {
      const jp = createJourneyPattern({
        privateCode: 'PRIV001',
      });

      const result = journeyPatternToPayload(jp);

      expect(result.privateCode).toBe('PRIV001');
    });

    it('preserves directionType property', () => {
      const jp = createJourneyPattern({
        directionType: DIRECTION_TYPE.INBOUND,
      });

      const result = journeyPatternToPayload(jp);

      expect(result.directionType).toBe(DIRECTION_TYPE.INBOUND);
    });

    it('preserves null values for optional properties', () => {
      const jp = createJourneyPattern({
        description: null,
        privateCode: null,
        directionType: null,
      });

      const result = journeyPatternToPayload(jp);

      expect(result.description).toBeNull();
      expect(result.privateCode).toBeNull();
      expect(result.directionType).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles minimal journey pattern', () => {
      const jp = createEmptyJourneyPattern();

      const result = journeyPatternToPayload(jp);

      expect(result.pointsInSequence).toEqual([]);
      expect(result.serviceJourneys).toEqual([]);
    });

    it('handles two-stop journey pattern', () => {
      const jp = createJourneyPatternWithStops(2);

      const result = journeyPatternToPayload(jp);

      expect(result.pointsInSequence).toHaveLength(2);
      expect(result.serviceJourneys).toHaveLength(1);
      expect(result.serviceJourneys[0].passingTimes).toHaveLength(2);
    });

    it('handles single-stop journey pattern', () => {
      const jp = createJourneyPatternWithStops(1);

      const result = journeyPatternToPayload(jp);

      expect(result.pointsInSequence).toHaveLength(1);
      expect(result.serviceJourneys[0].passingTimes).toHaveLength(1);
    });

    it('handles journey pattern with all properties', () => {
      const jp = createJourneyPattern({
        id: 'TST:JourneyPattern:full',
        name: 'Full Journey Pattern',
        description: 'Complete test pattern',
        privateCode: 'PRIV',
        directionType: DIRECTION_TYPE.OUTBOUND,
        pointsInSequence: createStopPointSequence(3),
        serviceJourneys: [createServiceJourneyWithPassingTimes(3)],
        notices: [{ text: 'Important notice' }],
      });

      const result = journeyPatternToPayload(jp);

      expect(result.id).toBe('TST:JourneyPattern:full');
      expect(result.name).toBe('Full Journey Pattern');
      expect(result.description).toBe('Complete test pattern');
      expect(result.privateCode).toBe('PRIV');
      expect(result.directionType).toBe(DIRECTION_TYPE.OUTBOUND);
      expect(result.pointsInSequence).toHaveLength(3);
      expect(result.serviceJourneys).toHaveLength(1);
      expect(result.notices).toEqual([{ text: 'Important notice' }]);
    });

    it('handles mixed flexible and quay stop points', () => {
      const jp = createJourneyPattern({
        pointsInSequence: [
          createQuayStopPoint('TST:Quay:1'),
          createFlexibleStopPoint(),
          createQuayStopPoint('TST:Quay:2'),
        ],
      });

      // Non-flexible mode
      const result = journeyPatternToPayload(jp, false);

      expect(result.pointsInSequence).toHaveLength(3);
      expect(result.pointsInSequence[0].quayRef).toBe('TST:Quay:1');
      expect(result.pointsInSequence[1]).not.toHaveProperty('key');
      expect(result.pointsInSequence[2].quayRef).toBe('TST:Quay:2');
    });
  });
});
