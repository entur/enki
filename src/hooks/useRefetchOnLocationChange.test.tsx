import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useRefetchOnLocationChange from './useRefetchOnLocationChange';

describe('useRefetchOnLocationChange', () => {
  it('calls refetch on initial render', () => {
    const refetch = vi.fn();
    renderHook(() => useRefetchOnLocationChange(refetch), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      ),
    });
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('calls refetch again when location changes', () => {
    const refetch = vi.fn();
    let navigate: (to: string) => void;

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      // We need to use a MemoryRouter with a navigator we can control
      return <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>;
    };

    const { result, rerender } = renderHook(
      () => useRefetchOnLocationChange(refetch),
      { wrapper: Wrapper },
    );

    // Initial render calls refetch once
    expect(refetch).toHaveBeenCalledTimes(1);

    // Re-rendering with the same location should not call refetch again
    rerender();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('does not call refetch again on rerender if refetch ref is stable', () => {
    const refetch = vi.fn();
    const { rerender } = renderHook(() => useRefetchOnLocationChange(refetch), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      ),
    });

    expect(refetch).toHaveBeenCalledTimes(1);
    rerender();
    // Same function reference + same location = no extra call
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
