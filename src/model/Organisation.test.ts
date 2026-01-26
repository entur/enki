import { describe, it, expect } from 'vitest';
import {
  filterAuthorities,
  filterNetexOperators,
  Organisation,
} from './Organisation';

// Helper to create test organisations
const createOrganisation = (
  id: string,
  type: 'authority' | 'operator',
  name: string = `Org ${id}`,
): Organisation => ({
  id,
  name: { lang: 'en', value: name },
  type,
});

describe('filterAuthorities', () => {
  describe('filtering behavior', () => {
    it('returns empty array when input is empty', () => {
      const result = filterAuthorities([]);
      expect(result).toEqual([]);
    });

    it('returns empty array when no authorities exist', () => {
      const organisations: Organisation[] = [
        createOrganisation('1', 'operator'),
        createOrganisation('2', 'operator'),
      ];

      const result = filterAuthorities(organisations);

      expect(result).toEqual([]);
    });

    it('returns only authorities when mixed types exist', () => {
      const authority = createOrganisation('1', 'authority', 'Authority Org');
      const operator = createOrganisation('2', 'operator', 'Operator Org');
      const organisations: Organisation[] = [authority, operator];

      const result = filterAuthorities(organisations);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(authority);
    });

    it('returns all items when all are authorities', () => {
      const organisations: Organisation[] = [
        createOrganisation('1', 'authority'),
        createOrganisation('2', 'authority'),
        createOrganisation('3', 'authority'),
      ];

      const result = filterAuthorities(organisations);

      expect(result).toHaveLength(3);
    });

    it('preserves organisation properties', () => {
      const organisation: Organisation = {
        id: 'TST:Authority:1',
        name: { lang: 'nb', value: 'Norsk Myndighet' },
        type: 'authority',
      };

      const result = filterAuthorities([organisation]);

      expect(result[0].id).toBe('TST:Authority:1');
      expect(result[0].name.lang).toBe('nb');
      expect(result[0].name.value).toBe('Norsk Myndighet');
    });
  });

  describe('null/undefined handling', () => {
    it('returns undefined when input is undefined', () => {
      const result = filterAuthorities(undefined as unknown as Organisation[]);
      expect(result).toBeUndefined();
    });

    it('returns undefined when input is null', () => {
      const result = filterAuthorities(null as unknown as Organisation[]);
      expect(result).toBeUndefined();
    });
  });
});

describe('filterNetexOperators', () => {
  describe('filtering behavior', () => {
    it('returns empty array when input is empty', () => {
      const result = filterNetexOperators([]);
      expect(result).toEqual([]);
    });

    it('returns empty array when no operators exist', () => {
      const organisations: Organisation[] = [
        createOrganisation('1', 'authority'),
        createOrganisation('2', 'authority'),
      ];

      const result = filterNetexOperators(organisations);

      expect(result).toEqual([]);
    });

    it('returns only operators when mixed types exist', () => {
      const authority = createOrganisation('1', 'authority', 'Authority Org');
      const operator = createOrganisation('2', 'operator', 'Operator Org');
      const organisations: Organisation[] = [authority, operator];

      const result = filterNetexOperators(organisations);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(operator);
    });

    it('returns all items when all are operators', () => {
      const organisations: Organisation[] = [
        createOrganisation('1', 'operator'),
        createOrganisation('2', 'operator'),
        createOrganisation('3', 'operator'),
      ];

      const result = filterNetexOperators(organisations);

      expect(result).toHaveLength(3);
    });

    it('preserves organisation properties', () => {
      const organisation: Organisation = {
        id: 'TST:Operator:1',
        name: { lang: 'nb', value: 'Norsk Operatør' },
        type: 'operator',
      };

      const result = filterNetexOperators([organisation]);

      expect(result[0].id).toBe('TST:Operator:1');
      expect(result[0].name.lang).toBe('nb');
      expect(result[0].name.value).toBe('Norsk Operatør');
    });
  });

  describe('null/undefined handling (throws)', () => {
    it('throws error when input is undefined', () => {
      expect(() => {
        filterNetexOperators(undefined as unknown as Organisation[]);
      }).toThrow();
    });

    it('throws error when input is null', () => {
      expect(() => {
        filterNetexOperators(null as unknown as Organisation[]);
      }).toThrow();
    });
  });
});
