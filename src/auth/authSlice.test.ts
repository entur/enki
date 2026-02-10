import reducer, { updateAuth, AuthState } from './authSlice';
import { Auth } from './auth';

describe('authSlice', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.loaded).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(typeof state.getAccessToken).toBe('function');
    expect(typeof state.logout).toBe('function');
    expect(typeof state.login).toBe('function');
  });

  it('updateAuth sets loaded to true and spreads auth payload', () => {
    const auth: Auth = {
      isLoading: false,
      isAuthenticated: true,
      getAccessToken: () => Promise.resolve('token'),
      logout: () => Promise.resolve(),
      login: () => Promise.resolve(),
    };
    const result = reducer(undefined, updateAuth(auth));
    expect(result.loaded).toBe(true);
    expect(result.isAuthenticated).toBe(true);
    expect(result.isLoading).toBe(false);
  });

  it('updateAuth replaces previous auth state', () => {
    const initial: AuthState = {
      loaded: true,
      isLoading: false,
      isAuthenticated: true,
      getAccessToken: () => Promise.resolve('old'),
      logout: () => Promise.resolve(),
      login: () => Promise.resolve(),
    };
    const newAuth: Auth = {
      isLoading: true,
      isAuthenticated: false,
      getAccessToken: () => Promise.resolve('new'),
      logout: () => Promise.resolve(),
      login: () => Promise.resolve(),
    };
    const result = reducer(initial, updateAuth(newAuth));
    expect(result.loaded).toBe(true);
    expect(result.isAuthenticated).toBe(false);
    expect(result.isLoading).toBe(true);
  });
});
