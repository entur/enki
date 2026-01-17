import { renderHook } from '@testing-library/react';
import usePristine from './usePristine';

/**
 * @vitest-environment jsdom
 */
describe('usePristine', () => {
  describe('initial state', () => {
    it('should return true when value has not changed and spoil is false', () => {
      const { result } = renderHook(() => usePristine('initial', false));
      expect(result.current).toBe(true);
    });

    it('should return false when spoil is true even with unchanged value', () => {
      const { result } = renderHook(() => usePristine('initial', true));
      expect(result.current).toBe(false);
    });
  });

  describe('value change detection', () => {
    it('should return false after value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: 'initial', spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: 'changed', spoil: false });

      expect(result.current).toBe(false);
    });

    it('should remain true when rerendered with same value', () => {
      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: 'initial', spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: 'initial', spoil: false });

      expect(result.current).toBe(true);
    });
  });

  describe('one-way state transition', () => {
    it('should remain false even if value returns to initial', () => {
      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: 'initial', spoil: false } },
      );

      expect(result.current).toBe(true);

      // Change value
      rerender({ value: 'changed', spoil: false });
      expect(result.current).toBe(false);

      // Return to initial value
      rerender({ value: 'initial', spoil: false });
      expect(result.current).toBe(false);
    });
  });

  describe('spoil parameter', () => {
    it('should return false when spoil changes to true', () => {
      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: 'initial', spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: 'initial', spoil: true });

      expect(result.current).toBe(false);
    });

    it('should return true when spoil changes back to false (if value unchanged)', () => {
      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: 'initial', spoil: true } },
      );

      expect(result.current).toBe(false);

      rerender({ value: 'initial', spoil: false });

      expect(result.current).toBe(true);
    });
  });

  describe('deep equality with objects', () => {
    it('should remain true for deeply equal objects', () => {
      const initialObj = { name: 'test', value: 123 };
      const sameObj = { name: 'test', value: 123 };

      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: initialObj, spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: sameObj, spoil: false });

      expect(result.current).toBe(true);
    });

    it('should return false for different objects', () => {
      const initialObj = { name: 'test', value: 123 };
      const differentObj = { name: 'test', value: 456 };

      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: initialObj, spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: differentObj, spoil: false });

      expect(result.current).toBe(false);
    });
  });

  describe('deep equality with arrays', () => {
    it('should remain true for deeply equal arrays', () => {
      const initialArr = [1, 2, { nested: 'value' }];
      const sameArr = [1, 2, { nested: 'value' }];

      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: initialArr, spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: sameArr, spoil: false });

      expect(result.current).toBe(true);
    });

    it('should return false for different arrays', () => {
      const initialArr = [1, 2, 3];
      const differentArr = [1, 2, 4];

      const { result, rerender } = renderHook(
        ({ value, spoil }) => usePristine(value, spoil),
        { initialProps: { value: initialArr, spoil: false } },
      );

      expect(result.current).toBe(true);

      rerender({ value: differentArr, spoil: false });

      expect(result.current).toBe(false);
    });
  });
});
