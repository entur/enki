import { createUuid } from './generators';

describe('generators', () => {
  describe('createUuid', () => {
    it('should return a string', () => {
      const result = createUuid();
      expect(typeof result).toBe('string');
    });

    it('should return exactly 8 characters', () => {
      const result = createUuid();
      expect(result).toHaveLength(8);
    });

    it('should only contain valid hexadecimal characters', () => {
      const result = createUuid();
      expect(result).toMatch(/^[0-9a-f]{8}$/);
    });

    it('should generate unique values on subsequent calls', () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        results.add(createUuid());
      }
      // With 100 UUIDs, we should have 100 unique values
      // (collision probability is astronomically low)
      expect(results.size).toBe(100);
    });

    it('should not contain hyphens', () => {
      const result = createUuid();
      expect(result).not.toContain('-');
    });
  });
});
