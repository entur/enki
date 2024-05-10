import { renderHook } from '@testing-library/react';

import { useAuth } from './auth';

vi.mock('react-oidc-context', async () => {
  return {
    ...(await vi.importActual('react-oidc-context')),
    useAuth: () => ({
      isLoading: false,
      isAuthenticated: true,
      activeNavigator: 'signinRedirect',
      user: {
        access_token: 'test-token',
      },
      signoutRedirect: () => Promise.resolve(),
      signinRedirect: () => Promise.resolve(),
    }),
  };
});

const testHook = () => {
  return renderHook(() => useAuth());
};

/**
 * @jest-environment jsdom
 */
describe('useAuth', () => {
  test('isLoading', () => {
    const { result } = testHook();
    expect(result.current.isLoading).toBe(false);
  });

  test('isAuthenticated', () => {
    const { result } = testHook();
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('getAccessToken', async () => {
    const { result } = testHook();
    expect(await result.current.getAccessToken()).toBe('test-token');
  });

  test('login', async () => {
    const { result } = testHook();
    await expect(result.current.login()).resolves.not.toThrowError();
  });

  test('logout', async () => {
    const { result } = testHook();
    await expect(
      result.current.logout({ returnTo: '/' }),
    ).resolves.not.toThrowError();
  });
});
