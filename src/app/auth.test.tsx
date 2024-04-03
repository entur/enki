import { renderHook } from '@testing-library/react';
import { ConfigContext } from 'config/ConfigContext';

import { useAuth } from './auth';

vi.mock('react-oidc-context', async () => {
  return {
    ...(await vi.importActual('react-oidc-context')),
    useAuth: () => ({
      isLoading: false,
      isAuthenticated: true,
      activeNavigator: 'signinRedirect',
      user: {
        profile: {
          preferred_name: 'Test Name',
          claims: ['{"r":"adminEditRouteData","o":"RB"}'],
        },
        access_token: 'test-token',
      },
      signoutRedirect: () => Promise.resolve(),
      signinRedirect: () => Promise.resolve(),
    }),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigContext.Provider
    value={{
      preferredNameNamespace: 'preferred_name',
      claimsNamespace: 'claims',
    }}
  >
    {children}
  </ConfigContext.Provider>
);

const testHook = () => {
  return renderHook(() => useAuth(), { wrapper });
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

  test('user.name', () => {
    const { result } = testHook();
    // @ts-ignore
    expect(result.current.user.name).toBe('Test Name');
  });

  test('roleAssignments', () => {
    const { result } = testHook();
    expect(result.current.roleAssignments).toEqual([
      '{"r":"adminEditRouteData","o":"RB"}',
    ]);
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
      result.current.logout({ returnTo: '/' })
    ).resolves.not.toThrowError();
  });
});
