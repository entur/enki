import { describe, it, expect } from 'vitest';
import { createJourneyPattern } from 'test/factories';
import {
  validateJourneyPatternName,
  getJourneyPatternNames,
} from './journeyPatternName';

describe('validateJourneyPatternName', () => {
  describe('empty name validation', () => {
    it('should return emptyName error for null name', () => {
      const result = validateJourneyPatternName(null, []);
      expect(result.emptyName).toBeDefined();
      expect(result.duplicateName).toBeUndefined();
    });

    it('should return emptyName error for undefined name', () => {
      const result = validateJourneyPatternName(undefined, []);
      expect(result.emptyName).toBeDefined();
    });

    it('should return emptyName error for empty string', () => {
      const result = validateJourneyPatternName('', []);
      expect(result.emptyName).toBeDefined();
    });

    it('should return emptyName error for whitespace-only string', () => {
      const result = validateJourneyPatternName('   ', []);
      expect(result.emptyName).toBeDefined();
    });

    it('should use custom empty name message', () => {
      const result = validateJourneyPatternName(null, [], 'Custom empty');
      expect(result.emptyName).toBe('Custom empty');
    });

    it('should use default empty name message when not provided', () => {
      const result = validateJourneyPatternName(null, []);
      expect(result.emptyName).toBe('Name is required');
    });
  });

  describe('duplicate name validation', () => {
    it('should return duplicateName error for existing name', () => {
      const result = validateJourneyPatternName('Route A', [
        'Route A',
        'Route B',
      ]);
      expect(result.duplicateName).toBeDefined();
      expect(result.emptyName).toBeUndefined();
    });

    it('should return duplicateName error for existing name with different whitespace', () => {
      const result = validateJourneyPatternName('  Route A  ', [
        'Route A',
        'Route B',
      ]);
      expect(result.duplicateName).toBeDefined();
    });

    it('should use custom duplicate name message', () => {
      const result = validateJourneyPatternName(
        'Route A',
        ['Route A'],
        'Empty',
        'Custom duplicate',
      );
      expect(result.duplicateName).toBe('Custom duplicate');
    });

    it('should use default duplicate name message when not provided', () => {
      const result = validateJourneyPatternName('Route A', ['Route A']);
      expect(result.duplicateName).toBe('Name already exists');
    });
  });

  describe('valid name scenarios', () => {
    it('should return empty object for valid unique name', () => {
      const result = validateJourneyPatternName('Route C', [
        'Route A',
        'Route B',
      ]);
      expect(result.emptyName).toBeUndefined();
      expect(result.duplicateName).toBeUndefined();
    });

    it('should handle empty existing names array', () => {
      const result = validateJourneyPatternName('Route A', []);
      expect(result.emptyName).toBeUndefined();
      expect(result.duplicateName).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const result = validateJourneyPatternName('route a', ['Route A']);
      expect(result.duplicateName).toBeUndefined();
    });

    it('should handle names with special characters', () => {
      const result = validateJourneyPatternName('Route #1 (Express)', [
        'Route A',
      ]);
      expect(result.emptyName).toBeUndefined();
      expect(result.duplicateName).toBeUndefined();
    });
  });

  describe('whitespace handling', () => {
    it('should normalize whitespace when comparing', () => {
      const result = validateJourneyPatternName('Route A', [
        '  Route A  ',
        'Route B',
      ]);
      expect(result.duplicateName).toBeDefined();
    });

    it('should handle existing names with only whitespace', () => {
      const result = validateJourneyPatternName('Route A', ['   ', 'Route B']);
      expect(result.duplicateName).toBeUndefined();
    });
  });
});

describe('getJourneyPatternNames', () => {
  describe('extracting names', () => {
    it('should extract names from journey patterns', () => {
      const journeyPatterns = [
        createJourneyPattern({ name: 'Route A' }),
        createJourneyPattern({ name: 'Route B' }),
      ];

      const result = getJourneyPatternNames(journeyPatterns);

      expect(result).toEqual(['Route A', 'Route B']);
    });

    it('should return empty array for undefined', () => {
      const result = getJourneyPatternNames(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty journey patterns array', () => {
      const result = getJourneyPatternNames([]);
      expect(result).toEqual([]);
    });
  });

  describe('null/undefined name handling', () => {
    it('should handle journey patterns with undefined names', () => {
      // Manually construct to bypass factory defaults
      const journeyPatterns = [
        createJourneyPattern({ name: 'Route A' }),
        { ...createJourneyPattern(), name: undefined as unknown as string },
      ];

      const result = getJourneyPatternNames(journeyPatterns);

      expect(result).toEqual(['Route A', '']);
    });

    it('should handle journey patterns with null names', () => {
      // Manually construct to bypass factory defaults
      const journeyPatterns = [
        createJourneyPattern({ name: 'Route A' }),
        { ...createJourneyPattern(), name: null as unknown as string },
      ];

      const result = getJourneyPatternNames(journeyPatterns);

      expect(result).toEqual(['Route A', '']);
    });
  });

  describe('whitespace handling', () => {
    it('should trim whitespace from names', () => {
      const journeyPatterns = [
        createJourneyPattern({ name: '  Route A  ' }),
        createJourneyPattern({ name: 'Route B' }),
      ];

      const result = getJourneyPatternNames(journeyPatterns);

      expect(result).toEqual(['Route A', 'Route B']);
    });

    it('should handle whitespace-only names', () => {
      const journeyPatterns = [createJourneyPattern({ name: '   ' })];

      const result = getJourneyPatternNames(journeyPatterns);

      expect(result).toEqual(['']);
    });
  });

  describe('integration with validateJourneyPatternName', () => {
    it('should work together for duplicate detection', () => {
      const journeyPatterns = [
        createJourneyPattern({ name: 'Route A' }),
        createJourneyPattern({ name: 'Route B' }),
      ];

      const existingNames = getJourneyPatternNames(journeyPatterns);
      const result = validateJourneyPatternName('Route A', existingNames);

      expect(result.duplicateName).toBeDefined();
    });

    it('should work together for unique name validation', () => {
      const journeyPatterns = [
        createJourneyPattern({ name: 'Route A' }),
        createJourneyPattern({ name: 'Route B' }),
      ];

      const existingNames = getJourneyPatternNames(journeyPatterns);
      const result = validateJourneyPatternName('Route C', existingNames);

      expect(result.emptyName).toBeUndefined();
      expect(result.duplicateName).toBeUndefined();
    });
  });
});
