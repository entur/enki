import { renderHook } from '@testing-library/react';
import useUniqueKeys from './useUniqueKeys';

// Mock uuid to return predictable, incrementing values
vi.mock('uuid', () => {
  let counter = 0;
  return {
    v4: () => `uuid-${++counter}`,
  };
});

/**
 * @vitest-environment jsdom
 */
describe('useUniqueKeys', () => {
  describe('initial state', () => {
    it('should return array with length list.length + 1', () => {
      const { result } = renderHook(() => useUniqueKeys(['a', 'b', 'c']));
      expect(result.current).toHaveLength(4); // 3 + 1
    });

    it('should return array of unique UUID strings', () => {
      const { result } = renderHook(() => useUniqueKeys(['a', 'b']));
      expect(result.current).toHaveLength(3);
      // All UUIDs should be unique
      const uniqueSet = new Set(result.current);
      expect(uniqueSet.size).toBe(3);
      // All UUIDs should be strings matching our mock pattern
      result.current.forEach((id) => {
        expect(id).toMatch(/^uuid-\d+$/);
      });
    });

    it('should handle empty list', () => {
      const { result } = renderHook(() => useUniqueKeys([]));
      expect(result.current).toHaveLength(1); // 0 + 1
    });
  });

  describe('list additions', () => {
    it('should append new UUID when item is added', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: ['a', 'b'] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(3);

      rerender({ list: ['a', 'b', 'c'] });

      expect(result.current).toHaveLength(4);
      // First 3 IDs should be unchanged
      expect(result.current.slice(0, 3)).toEqual(initialIds);
      // New ID should be different from all initial IDs
      expect(initialIds).not.toContain(result.current[3]);
    });

    it('should handle multiple consecutive additions', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: ['a'] } },
      );

      const firstIds = [...result.current];
      expect(firstIds).toHaveLength(2);

      rerender({ list: ['a', 'b'] });
      expect(result.current).toHaveLength(3);
      expect(result.current.slice(0, 2)).toEqual(firstIds);

      const secondIds = [...result.current];

      rerender({ list: ['a', 'b', 'c'] });
      expect(result.current).toHaveLength(4);
      expect(result.current.slice(0, 3)).toEqual(secondIds);
    });
  });

  describe('list deletions', () => {
    it('should remove UUID corresponding to deleted item', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: ['a', 'b', 'c'] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(4);

      // Remove 'b' (index 1)
      rerender({ list: ['a', 'c'] });

      // The ID at index 1 (for 'b') should be removed
      expect(result.current).toHaveLength(3);
      expect(result.current[0]).toBe(initialIds[0]); // 'a' keeps its ID
      expect(result.current[1]).toBe(initialIds[2]); // 'c' keeps its ID
      expect(result.current[2]).toBe(initialIds[3]); // extra slot keeps its ID
    });

    it('should remove first UUID when first item deleted', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: ['a', 'b', 'c'] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(4);

      // Remove 'a' (index 0)
      rerender({ list: ['b', 'c'] });

      expect(result.current).toHaveLength(3);
      expect(result.current[0]).toBe(initialIds[1]); // 'b' keeps its ID
      expect(result.current[1]).toBe(initialIds[2]); // 'c' keeps its ID
      expect(result.current[2]).toBe(initialIds[3]); // extra slot keeps its ID
    });

    it('should remove last item UUID when last item deleted', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: ['a', 'b', 'c'] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(4);

      // Remove 'c' (index 2)
      rerender({ list: ['a', 'b'] });

      expect(result.current).toHaveLength(3);
      expect(result.current[0]).toBe(initialIds[0]); // 'a' keeps its ID
      expect(result.current[1]).toBe(initialIds[1]); // 'b' keeps its ID
      expect(result.current[2]).toBe(initialIds[3]); // extra slot keeps its ID
    });
  });

  describe('key stability', () => {
    it('should maintain same keys when list is unchanged', () => {
      const list = ['a', 'b', 'c'];
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list } },
      );

      const initialIds = [...result.current];

      // Rerender with same list
      rerender({ list: ['a', 'b', 'c'] });

      expect(result.current).toEqual(initialIds);
    });
  });

  describe('deep equality with objects', () => {
    it('should correctly identify deleted object using deep equality', () => {
      const obj1 = { id: 1, name: 'first' };
      const obj2 = { id: 2, name: 'second' };
      const obj3 = { id: 3, name: 'third' };

      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: [obj1, obj2, obj3] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(4);

      // Remove obj2 (middle object)
      rerender({ list: [obj1, obj3] });

      // ID for obj2 should be removed
      expect(result.current).toHaveLength(3);
      expect(result.current[0]).toBe(initialIds[0]); // obj1 keeps its ID
      expect(result.current[1]).toBe(initialIds[2]); // obj3 keeps its ID
      expect(result.current[2]).toBe(initialIds[3]); // extra slot keeps its ID
    });

    it('should handle objects with same reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };

      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: [obj1, obj2] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(3);

      // Rerender with same object references
      rerender({ list: [obj1, obj2] });

      expect(result.current).toHaveLength(3);
      expect(result.current).toEqual(initialIds);
    });
  });

  describe('edge cases', () => {
    it('should handle transition from empty to non-empty list', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: [] as string[] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(1);

      rerender({ list: ['a'] });

      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialIds[0]); // original ID preserved
    });

    it('should handle transition from non-empty to empty list', () => {
      const { result, rerender } = renderHook(
        ({ list }) => useUniqueKeys(list),
        { initialProps: { list: ['a'] } },
      );

      const initialIds = [...result.current];
      expect(initialIds).toHaveLength(2);

      rerender({ list: [] });

      expect(result.current).toHaveLength(1);
      expect(result.current[0]).toBe(initialIds[1]); // extra slot ID preserved
    });

    it('should handle single item list', () => {
      const { result } = renderHook(() => useUniqueKeys(['single']));
      expect(result.current).toHaveLength(2);
      // Both should be unique UUIDs
      const uniqueSet = new Set(result.current);
      expect(uniqueSet.size).toBe(2);
    });
  });
});
