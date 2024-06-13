import { renderHook } from '@testing-library/react';

import { useAuth } from './auth';
import { ConfigContext } from '../config/ConfigContext';

let isAuthenticated = true;

const config = {
  disableAutomaticLoginRedirect: false,
};

let signinRedirectMock = vi.fn().mockResolvedValue(undefined);

vi.mock('react-oidc-context', async () => {
  return {
    ...(await vi.importActual('react-oidc-context')),
    useAuth: () => ({
      isLoading: false,
      isAuthenticated: isAuthenticated,
      activeNavigator: 'signinRedirect',
      user: {
        access_token: 'test-token',
      },
      signoutRedirect: () => Promise.resolve(),
      signinRedirect: () => signinRedirectMock,
    }),
  };
});

const testHook = () => {
  return renderHook(() => useAuth(), {
    wrapper: ({ children }) => (
      <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
    ),
  });
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
    expect(await result.current.login()).not.toThrowError();
  });

  test('logout', async () => {
    const { result } = testHook();
    await expect(
      result.current.logout({ returnTo: '/' }),
    ).resolves.not.toThrowError();
  });

  test('login redirect', async () => {
    isAuthenticated = false;
    const { result } = testHook();
    expect(result.current.isAuthenticated).toBe(false);
    expect(signinRedirectMock).toHaveBeenCalledOnce();
  });
});
