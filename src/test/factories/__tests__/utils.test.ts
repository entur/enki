import {
  createTestId,
  resetIdCounters,
  createStopPointKey,
  deepMerge,
  createTime,
  createDate,
} from '../utils';

describe('Factory Utilities', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('createTestId', () => {
    it('generates sequential IDs', () => {
      expect(createTestId('Line')).toBe('TST:Line:1');
      expect(createTestId('Line')).toBe('TST:Line:2');
      expect(createTestId('Line')).toBe('TST:Line:3');
    });

    it('maintains separate counters per type', () => {
      expect(createTestId('Line')).toBe('TST:Line:1');
      expect(createTestId('JourneyPattern')).toBe('TST:JourneyPattern:1');
      expect(createTestId('Line')).toBe('TST:Line:2');
    });

    it('supports custom authority prefix', () => {
      expect(createTestId('Line', 'FIN')).toBe('FIN:Line:1');
    });
  });

  describe('resetIdCounters', () => {
    it('resets all counters', () => {
      createTestId('Line');
      createTestId('Line');
      resetIdCounters();
      expect(createTestId('Line')).toBe('TST:Line:1');
    });
  });

  describe('createStopPointKey', () => {
    it('generates 12-char hex keys', () => {
      const key = createStopPointKey();
      expect(key).toHaveLength(12);
      expect(key).toMatch(/^[0-9a-f]{12}$/);
    });

    it('generates different keys on each call', () => {
      const key1 = createStopPointKey();
      const key2 = createStopPointKey();
      // While theoretically could be same, practically won't
      expect(key1).not.toBe(key2);
    });
  });

  describe('deepMerge', () => {
    it('handles undefined source', () => {
      const target = { a: 1 };
      expect(deepMerge(target, undefined)).toEqual({ a: 1 });
    });

    it('merges primitive values', () => {
      expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });

    it('merges nested objects', () => {
      const target = { a: { b: 1, c: 2 } };
      const source = { a: { b: 3 } };
      expect(deepMerge(target, source)).toEqual({ a: { b: 3, c: 2 } });
    });

    it('replaces arrays entirely', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };
      expect(deepMerge(target, source)).toEqual({ items: [4, 5] });
    });

    it('handles null values', () => {
      const target: { a: number | null } = { a: 1 };
      expect(deepMerge(target, { a: null })).toEqual({ a: null });
    });

    it('does not modify target', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { a: 3 };
      const result = deepMerge(target, source);
      expect(target).toEqual({ a: 1, b: { c: 2 } });
      expect(result).toEqual({ a: 3, b: { c: 2 } });
    });

    it('handles deeply nested objects', () => {
      const target = { a: { b: { c: { d: 1 } } } };
      const source = { a: { b: { c: { d: 2 } } } };
      expect(deepMerge(target, source)).toEqual({ a: { b: { c: { d: 2 } } } });
    });

    it('preserves unmentioned keys at all levels', () => {
      const target = { a: { b: 1, c: 2 }, d: 3 };
      const source = { a: { b: 5 } };
      expect(deepMerge(target, source)).toEqual({ a: { b: 5, c: 2 }, d: 3 });
    });
  });

  describe('createTime', () => {
    it('formats time correctly', () => {
      expect(createTime(9, 5)).toBe('09:05:00');
      expect(createTime(14, 30, 45)).toBe('14:30:45');
    });

    it('pads single digit hours and minutes', () => {
      expect(createTime(1, 2, 3)).toBe('01:02:03');
    });

    it('handles midnight', () => {
      expect(createTime(0, 0)).toBe('00:00:00');
    });

    it('handles 23:59:59', () => {
      expect(createTime(23, 59, 59)).toBe('23:59:59');
    });
  });

  describe('createDate', () => {
    it('returns today by default', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(createDate()).toBe(today);
    });

    it('calculates positive offset dates', () => {
      const result = createDate(7);
      const expected = new Date();
      expected.setDate(expected.getDate() + 7);
      expect(result).toBe(expected.toISOString().split('T')[0]);
    });

    it('calculates negative offset dates', () => {
      const result = createDate(-7);
      const expected = new Date();
      expected.setDate(expected.getDate() - 7);
      expect(result).toBe(expected.toISOString().split('T')[0]);
    });

    it('returns ISO format (YYYY-MM-DD)', () => {
      const result = createDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
