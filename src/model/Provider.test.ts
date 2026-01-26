import { describe, it, expect } from 'vitest';
import { sortProviders } from './Provider';
import Provider from './Provider';

describe('sortProviders', () => {
  describe('comparison behavior', () => {
    it('returns -1 when first provider name is alphabetically before second', () => {
      const a: Provider = { name: 'Alpha' };
      const b: Provider = { name: 'Beta' };

      expect(sortProviders(a, b)).toBe(-1);
    });

    it('returns 1 when first provider name is alphabetically after second', () => {
      const a: Provider = { name: 'Charlie' };
      const b: Provider = { name: 'Beta' };

      expect(sortProviders(a, b)).toBe(1);
    });

    it('returns 0 when provider names are equal', () => {
      const a: Provider = { name: 'Alpha' };
      const b: Provider = { name: 'Alpha' };

      expect(sortProviders(a, b)).toBe(0);
    });
  });

  describe('providers without names', () => {
    it('returns -1 when first provider has no name', () => {
      const a: Provider = {};
      const b: Provider = { name: 'Beta' };

      expect(sortProviders(a, b)).toBe(-1);
    });

    it('returns 1 when second provider has no name', () => {
      const a: Provider = { name: 'Alpha' };
      const b: Provider = {};

      expect(sortProviders(a, b)).toBe(1);
    });

    it('returns -1 when both providers have no name', () => {
      const a: Provider = {};
      const b: Provider = {};

      expect(sortProviders(a, b)).toBe(-1);
    });

    it('treats undefined name same as no name', () => {
      const a: Provider = { name: undefined };
      const b: Provider = { name: 'Beta' };

      expect(sortProviders(a, b)).toBe(-1);
    });

    it('treats empty string name as no name (falsy)', () => {
      const a: Provider = { name: '' };
      const b: Provider = { name: 'Beta' };

      expect(sortProviders(a, b)).toBe(-1);
    });
  });

  describe('case sensitivity', () => {
    it('sorts uppercase before lowercase (case-sensitive)', () => {
      const a: Provider = { name: 'Alpha' };
      const b: Provider = { name: 'alpha' };

      // 'A' (65) < 'a' (97) in ASCII
      expect(sortProviders(a, b)).toBe(-1);
    });

    it('sorts lowercase after uppercase', () => {
      const a: Provider = { name: 'beta' };
      const b: Provider = { name: 'Alpha' };

      // 'b' (98) > 'A' (65) in ASCII
      expect(sortProviders(a, b)).toBe(1);
    });
  });

  describe('Array.sort integration', () => {
    it('sorts an array of providers correctly', () => {
      const providers: Provider[] = [
        { name: 'Charlie' },
        { name: 'Alpha' },
        { name: 'Beta' },
      ];

      const sorted = [...providers].sort(sortProviders);

      expect(sorted[0].name).toBe('Alpha');
      expect(sorted[1].name).toBe('Beta');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('puts providers without names first', () => {
      const providers: Provider[] = [
        { name: 'Charlie' },
        {},
        { name: 'Alpha' },
      ];

      const sorted = [...providers].sort(sortProviders);

      expect(sorted[0].name).toBeUndefined();
      expect(sorted[1].name).toBe('Alpha');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('handles multiple providers without names', () => {
      const providers: Provider[] = [
        { name: 'Beta' },
        {},
        { name: 'Alpha' },
        { name: '' },
      ];

      const sorted = [...providers].sort(sortProviders);

      // Providers without names should be at the start
      expect(sorted[0].name).toBeFalsy();
      expect(sorted[1].name).toBeFalsy();
      expect(sorted[2].name).toBe('Alpha');
      expect(sorted[3].name).toBe('Beta');
    });

    it('preserves other properties when sorting', () => {
      const providers: Provider[] = [
        { name: 'Beta', code: 'B', id: '2' },
        { name: 'Alpha', code: 'A', id: '1' },
      ];

      const sorted = [...providers].sort(sortProviders);

      expect(sorted[0].code).toBe('A');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].code).toBe('B');
      expect(sorted[1].id).toBe('2');
    });
  });
});
