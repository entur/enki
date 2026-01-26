import { vi, describe, it, expect, beforeEach } from 'vitest';
import { normalizeFlexibleLineFromApi } from './flexibleLines';
import { createFlexibleLine } from 'test/factories/flexibleLine';
import { createFlexibleJourneyPattern } from 'test/factories/journeyPattern';
import {
  createFlexibleStopPoint,
  createFlexibleStopPlace,
} from 'test/factories/stopPoint';
import { createNetwork, createBranding } from 'test/factories/line';

// Mock createUuid for deterministic tests
vi.mock('helpers/generators', () => ({
  createUuid: vi.fn(() => 'test-uuid'),
}));

describe('flexibleLines helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('normalizeFlexibleLineFromApi', () => {
    it('should add key to each point in sequence', () => {
      const stopPoint1 = createFlexibleStopPoint();
      const stopPoint2 = createFlexibleStopPoint();
      const journeyPattern = createFlexibleJourneyPattern(2, {
        pointsInSequence: [stopPoint1, stopPoint2],
      });
      const line = createFlexibleLine({ journeyPatterns: [journeyPattern] });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.journeyPatterns![0].pointsInSequence[0].key).toBe(
        'test-uuid',
      );
      expect(result.journeyPatterns![0].pointsInSequence[1].key).toBe(
        'test-uuid',
      );
    });

    it('should extract flexibleStopPlaceRef from nested object', () => {
      const flexibleStopPlace = createFlexibleStopPlace({ id: 'fsp-123' });
      const stopPoint = createFlexibleStopPoint({
        flexibleStopPlace,
        flexibleStopPlaceRef: undefined,
      });
      const journeyPattern = createFlexibleJourneyPattern(1, {
        pointsInSequence: [stopPoint],
      });
      const line = createFlexibleLine({ journeyPatterns: [journeyPattern] });

      const result = normalizeFlexibleLineFromApi(line);

      expect(
        result.journeyPatterns![0].pointsInSequence[0].flexibleStopPlaceRef,
      ).toBe('fsp-123');
    });

    it('should extract networkRef from nested network object', () => {
      const network = createNetwork({ id: 'network-456' });
      const line = createFlexibleLine({ network, networkRef: undefined });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.networkRef).toBe('network-456');
    });

    it('should extract brandingRef from nested branding object', () => {
      const branding = createBranding({ id: 'branding-789' });
      const line = createFlexibleLine({ branding, brandingRef: undefined });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.brandingRef).toBe('branding-789');
    });

    it('should handle undefined journey patterns', () => {
      // Create a line and explicitly set journeyPatterns to undefined
      // to simulate an API response without journey patterns
      const line = createFlexibleLine();
      (line as { journeyPatterns?: unknown }).journeyPatterns = undefined;

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.journeyPatterns).toEqual([]);
    });

    it('should handle empty journey patterns array', () => {
      const line = createFlexibleLine({ journeyPatterns: [] });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.journeyPatterns).toEqual([]);
    });

    it('should handle journey pattern with empty pointsInSequence', () => {
      const journeyPattern = createFlexibleJourneyPattern(0, {
        pointsInSequence: [],
      });
      const line = createFlexibleLine({ journeyPatterns: [journeyPattern] });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.journeyPatterns![0].pointsInSequence).toEqual([]);
    });

    it('should handle undefined network and branding', () => {
      const line = createFlexibleLine({
        network: undefined,
        branding: undefined,
      });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.networkRef).toBeUndefined();
      expect(result.brandingRef).toBeUndefined();
    });

    it('should not mutate original line object', () => {
      const originalStopPoint = createFlexibleStopPoint();
      const journeyPattern = createFlexibleJourneyPattern(1, {
        pointsInSequence: [originalStopPoint],
      });
      const line = createFlexibleLine({ journeyPatterns: [journeyPattern] });
      const originalKey = line.journeyPatterns![0].pointsInSequence[0].key;

      normalizeFlexibleLineFromApi(line);

      expect(line.journeyPatterns![0].pointsInSequence[0].key).toBe(
        originalKey,
      );
    });

    it('should preserve all other line properties', () => {
      const line = createFlexibleLine({
        id: 'line-id',
        name: 'Test Line',
        description: 'Test Description',
        publicCode: 'TL1',
      });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.id).toBe('line-id');
      expect(result.name).toBe('Test Line');
      expect(result.description).toBe('Test Description');
      expect(result.publicCode).toBe('TL1');
    });

    it('should preserve journey pattern properties other than pointsInSequence', () => {
      const journeyPattern = createFlexibleJourneyPattern(1, {
        id: 'jp-123',
        name: 'Test JP',
        description: 'JP Description',
      });
      const line = createFlexibleLine({ journeyPatterns: [journeyPattern] });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.journeyPatterns![0].id).toBe('jp-123');
      expect(result.journeyPatterns![0].name).toBe('Test JP');
      expect(result.journeyPatterns![0].description).toBe('JP Description');
    });

    it('should preserve stop point properties other than key and flexibleStopPlaceRef', () => {
      const stopPoint = createFlexibleStopPoint({
        id: 'sp-123',
        forBoarding: true,
        forAlighting: false,
      });
      const journeyPattern = createFlexibleJourneyPattern(1, {
        pointsInSequence: [stopPoint],
      });
      const line = createFlexibleLine({ journeyPatterns: [journeyPattern] });

      const result = normalizeFlexibleLineFromApi(line);

      expect(result.journeyPatterns![0].pointsInSequence[0].id).toBe('sp-123');
      expect(result.journeyPatterns![0].pointsInSequence[0].forBoarding).toBe(
        true,
      );
      expect(result.journeyPatterns![0].pointsInSequence[0].forAlighting).toBe(
        false,
      );
    });
  });
});
