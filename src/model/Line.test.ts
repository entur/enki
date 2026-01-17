import { describe, it, expect, beforeEach } from 'vitest';
import { lineToPayload } from './Line';
import {
  createLine,
  createLineWithNetwork,
  createLineWithNotices,
  createLineWithJourneyPatterns,
  createEmptyLine,
  createNetwork,
  resetIdCounters,
} from 'test/factories';
import { Branding } from './Branding';

// Type helper for line payload which includes properties removed during transformation
// The lineToPayload return type doesn't include these fields but we check they're removed
type LinePayload = ReturnType<typeof lineToPayload> & {
  network?: unknown;
  branding?: unknown;
};

describe('lineToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('network and branding object removal', () => {
    it('removes network object from output', () => {
      const line = createLineWithNetwork();

      const result = lineToPayload(line) as LinePayload;

      expect(result.network).toBeUndefined();
      expect(result.networkRef).toBe(line.networkRef);
    });

    it('removes branding object from output', () => {
      const branding: Branding = {
        id: 'TST:Branding:1',
        name: 'Test Brand',
        shortName: 'TB',
        description: 'A test branding',
      };
      const line = createLine({
        branding,
        brandingRef: branding.id,
      });

      const result = lineToPayload(line) as LinePayload;

      expect(result.branding).toBeUndefined();
      expect(result.brandingRef).toBe('TST:Branding:1');
    });

    it('removes both network and branding objects', () => {
      const network = createNetwork();
      const branding: Branding = {
        id: 'TST:Branding:2',
        name: 'Brand Two',
      };
      const line = createLine({
        network,
        networkRef: network.id,
        branding,
        brandingRef: branding.id,
      });

      const result = lineToPayload(line) as LinePayload;

      expect(result.network).toBeUndefined();
      expect(result.branding).toBeUndefined();
      expect(result.networkRef).toBe(network.id);
      expect(result.brandingRef).toBe(branding.id);
    });
  });

  describe('brandingRef handling', () => {
    it('preserves existing brandingRef', () => {
      const line = createLine({
        brandingRef: 'TST:Branding:existing',
      });

      const result = lineToPayload(line);

      expect(result.brandingRef).toBe('TST:Branding:existing');
    });

    it('defaults to null when brandingRef is undefined', () => {
      const line = createLine({
        brandingRef: undefined,
      });

      const result = lineToPayload(line);

      expect(result.brandingRef).toBeNull();
    });

    it('defaults to null when brandingRef is not provided', () => {
      const line = createLine();
      delete (line as any).brandingRef;

      const result = lineToPayload(line);

      expect(result.brandingRef).toBeNull();
    });

    it('preserves empty string brandingRef as falsy value (becomes null)', () => {
      const line = createLine({
        brandingRef: '' as any,
      });

      const result = lineToPayload(line);

      // Empty string is falsy, so || null kicks in
      expect(result.brandingRef).toBeNull();
    });
  });

  describe('journeyPatterns transformation', () => {
    it('transforms journey patterns using journeyPatternToPayload', () => {
      const line = createLineWithJourneyPatterns(2, 3);

      const result = lineToPayload(line);

      expect(result.journeyPatterns).toHaveLength(2);
      // Each journey pattern should have pointsInSequence and serviceJourneys
      expect(result.journeyPatterns?.[0].pointsInSequence).toBeDefined();
      expect(result.journeyPatterns?.[0].serviceJourneys).toBeDefined();
    });

    it('handles empty journeyPatterns array', () => {
      const line = createLine({
        journeyPatterns: [],
      });

      const result = lineToPayload(line);

      expect(result.journeyPatterns).toEqual([]);
    });

    it('handles undefined journeyPatterns', () => {
      const line = createEmptyLine();
      delete (line as any).journeyPatterns;

      const result = lineToPayload(line);

      expect(result.journeyPatterns).toBeUndefined();
    });

    it('passes isFlexible=false by default to journeyPatternToPayload', () => {
      // When isFlexible is false, stopPointToPayload is called (not flexibleStopPointToPayload)
      // The main observable difference would be in how stop points are transformed
      const line = createLineWithJourneyPatterns(1, 2);

      const result = lineToPayload(line);

      // Journey patterns should be transformed with regular stop point handling
      expect(result.journeyPatterns).toHaveLength(1);
    });

    it('passes isFlexible=true when specified', () => {
      const line = createLineWithJourneyPatterns(1, 2);

      const result = lineToPayload(line, true);

      // Journey patterns should be transformed with flexible stop point handling
      expect(result.journeyPatterns).toHaveLength(1);
    });
  });

  describe('notices filtering', () => {
    it('preserves notices with text', () => {
      const line = createLineWithNotices([
        { text: 'Important notice 1' },
        { text: 'Important notice 2' },
      ]);

      const result = lineToPayload(line);

      expect(result.notices).toEqual([
        { text: 'Important notice 1' },
        { text: 'Important notice 2' },
      ]);
    });

    it('filters out notices with empty text', () => {
      const line = createLineWithNotices([
        { text: 'Valid notice' },
        { text: '' },
        { text: 'Another valid' },
      ]);

      const result = lineToPayload(line);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });

    it('filters out notices without text property', () => {
      const line = createLineWithNotices([
        { text: 'Valid notice' },
        {} as any,
        { text: 'Another valid' },
      ]);

      const result = lineToPayload(line);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });

    it('filters out null/undefined notices', () => {
      const line = createLineWithNotices([
        { text: 'Valid notice' },
        null as any,
        undefined as any,
      ]);

      const result = lineToPayload(line);

      expect(result.notices).toEqual([{ text: 'Valid notice' }]);
    });

    it('returns empty array when all notices are invalid', () => {
      const line = createLineWithNotices([
        { text: '' },
        {} as any,
        null as any,
      ]);

      const result = lineToPayload(line);

      expect(result.notices).toEqual([]);
    });

    it('handles undefined notices array', () => {
      const line = createLine();
      delete (line as any).notices;

      const result = lineToPayload(line);

      expect(result.notices).toBeUndefined();
    });
  });

  describe('property passthrough', () => {
    it('preserves id property', () => {
      const line = createLine({
        id: 'TST:Line:custom',
      });

      const result = lineToPayload(line);

      expect(result.id).toBe('TST:Line:custom');
    });

    it('preserves name property', () => {
      const line = createLine({
        name: 'Express Route',
      });

      const result = lineToPayload(line);

      expect(result.name).toBe('Express Route');
    });

    it('preserves description property', () => {
      const line = createLine({
        description: 'A scenic route through the city',
      });

      const result = lineToPayload(line);

      expect(result.description).toBe('A scenic route through the city');
    });

    it('preserves privateCode property', () => {
      const line = createLine({
        privateCode: 'PRIV001',
      });

      const result = lineToPayload(line);

      expect(result.privateCode).toBe('PRIV001');
    });

    it('preserves publicCode property', () => {
      const line = createLine({
        publicCode: '42A',
      });

      const result = lineToPayload(line);

      expect(result.publicCode).toBe('42A');
    });

    it('preserves transportMode property', () => {
      const line = createLine({
        transportMode: 'rail' as any,
      });

      const result = lineToPayload(line);

      expect(result.transportMode).toBe('rail');
    });

    it('preserves transportSubmode property', () => {
      const line = createLine({
        transportSubmode: 'local' as any,
      });

      const result = lineToPayload(line);

      expect(result.transportSubmode).toBe('local');
    });

    it('preserves networkRef property', () => {
      const line = createLine({
        networkRef: 'TST:Network:1',
      });

      const result = lineToPayload(line);

      expect(result.networkRef).toBe('TST:Network:1');
    });

    it('preserves operatorRef property', () => {
      const line = createLine({
        operatorRef: 'TST:Operator:1',
      });

      const result = lineToPayload(line);

      expect(result.operatorRef).toBe('TST:Operator:1');
    });

    it('preserves null values for optional properties', () => {
      const line = createLine({
        description: null,
        privateCode: null,
      });

      const result = lineToPayload(line);

      expect(result.description).toBeNull();
      expect(result.privateCode).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles minimal line', () => {
      const line: any = {
        journeyPatterns: [],
      };

      const result = lineToPayload(line);

      expect(result.journeyPatterns).toEqual([]);
      expect(result.brandingRef).toBeNull();
    });

    it('handles line with all properties', () => {
      const network = createNetwork();
      const branding: Branding = {
        id: 'TST:Branding:full',
        name: 'Full Brand',
      };
      const line = createLineWithJourneyPatterns(2, 3, {
        id: 'TST:Line:full',
        name: 'Full Test Line',
        description: 'Complete test line',
        privateCode: 'PRIV',
        publicCode: 'PUB',
        transportMode: 'bus' as any,
        transportSubmode: 'localBus' as any,
        network,
        networkRef: network.id,
        branding,
        brandingRef: branding.id,
        operatorRef: 'TST:Operator:1',
        notices: [{ text: 'Important notice' }],
      });

      const result = lineToPayload(line) as LinePayload;

      expect(result.id).toBe('TST:Line:full');
      expect(result.name).toBe('Full Test Line');
      expect(result.description).toBe('Complete test line');
      expect(result.privateCode).toBe('PRIV');
      expect(result.publicCode).toBe('PUB');
      expect(result.transportMode).toBe('bus');
      expect(result.transportSubmode).toBe('localBus');
      expect(result.network).toBeUndefined();
      expect(result.branding).toBeUndefined();
      expect(result.networkRef).toBe(network.id);
      expect(result.brandingRef).toBe(branding.id);
      expect(result.operatorRef).toBe('TST:Operator:1');
      expect(result.journeyPatterns).toHaveLength(2);
      expect(result.notices).toEqual([{ text: 'Important notice' }]);
    });

    it('does not mutate the original line object', () => {
      const network = createNetwork();
      const branding: Branding = {
        id: 'TST:Branding:1',
        name: 'Test',
      };
      const line = createLine({
        network,
        branding,
      });

      lineToPayload(line);

      // Original object should still have network and branding
      expect(line.network).toBe(network);
      expect(line.branding).toBe(branding);
    });
  });
});
