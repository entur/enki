import { renderHook } from '@testing-library/react';
import { usePrevious } from './hooks';

/**
 * @vitest-environment jsdom
 */
describe('hooks', () => {
  describe('usePrevious', () => {
    describe('initial render', () => {
      it('should return undefined on first render', () => {
        const { result } = renderHook(() => usePrevious('initial'));
        expect(result.current).toBeUndefined();
      });
    });

    describe('subsequent renders', () => {
      it('should return the previous value after a rerender', () => {
        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: 'first' } },
        );

        // First render returns undefined
        expect(result.current).toBeUndefined();

        // Rerender with new value
        rerender({ value: 'second' });

        // Now should return the previous value
        expect(result.current).toBe('first');
      });

      it('should track multiple sequential updates', () => {
        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: 1 } },
        );

        expect(result.current).toBeUndefined();

        rerender({ value: 2 });
        expect(result.current).toBe(1);

        rerender({ value: 3 });
        expect(result.current).toBe(2);

        rerender({ value: 4 });
        expect(result.current).toBe(3);
      });
    });

    describe('value types', () => {
      it('should work with string values', () => {
        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: 'hello' } },
        );

        rerender({ value: 'world' });
        expect(result.current).toBe('hello');
      });

      it('should work with number values', () => {
        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: 42 } },
        );

        rerender({ value: 100 });
        expect(result.current).toBe(42);
      });

      it('should work with boolean values', () => {
        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: true } },
        );

        rerender({ value: false });
        expect(result.current).toBe(true);
      });

      it('should work with object values', () => {
        const obj1 = { name: 'test' };
        const obj2 = { name: 'updated' };

        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: obj1 } },
        );

        rerender({ value: obj2 });
        expect(result.current).toBe(obj1);
      });

      it('should work with array values', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];

        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: arr1 } },
        );

        rerender({ value: arr2 });
        expect(result.current).toBe(arr1);
      });
    });

    describe('same value rerenders', () => {
      it('should still track the previous reference when value is the same', () => {
        const { result, rerender } = renderHook(
          ({ value }) => usePrevious(value),
          { initialProps: { value: 'same' } },
        );

        expect(result.current).toBeUndefined();

        rerender({ value: 'same' });
        // After first rerender with same value, previous is still from first render
        expect(result.current).toBe('same');
      });
    });
  });
});
