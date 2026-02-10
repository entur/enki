import reducer, { updateLocale, updateConfiguredLocale } from './intlSlice';

describe('intlSlice', () => {
  it('should return initial state with a locale', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.locale).toBeDefined();
    expect(typeof state.locale).toBe('string');
  });

  it('updateLocale sets the locale', () => {
    const result = reducer(undefined, updateLocale('en'));
    expect(result.locale).toBe('en');
  });

  it('updateLocale changes from one locale to another', () => {
    const state = reducer(undefined, updateLocale('nb'));
    const result = reducer(state, updateLocale('sv'));
    expect(result.locale).toBe('sv');
  });

  it('updateConfiguredLocale resolves locale via getLocale', () => {
    const result = reducer(undefined, updateConfiguredLocale('fi'));
    expect(result.locale).toBeDefined();
    expect(typeof result.locale).toBe('string');
  });

  it('updateLocale writes to localStorage via prepare callback', () => {
    reducer(undefined, updateLocale('en'));
    expect(localStorage.getItem('OT::locale')).toBe('en');
  });
});
