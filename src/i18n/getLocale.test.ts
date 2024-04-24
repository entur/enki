import { getLocale, LOCALE_KEY } from './getLocale';

describe('getLocale', () => {
  it('should return user defined locale if present', () => {
    localStorage.setItem(LOCALE_KEY, 'en');
    expect(getLocale()).toEqual('en');
    localStorage.removeItem(LOCALE_KEY);
  });

  it('should return configured default locale if present', () => {
    expect(getLocale('en')).toEqual('en');
  });

  it('should return navigator locale if present', () => {
    vi.stubGlobal('navigator', {
      languages: [],
      language: 'en-GB',
    });
    expect(getLocale()).toEqual('en');
    vi.unstubAllGlobals();
  });

  it('should return fallback default if navigator locale is not supported', () => {
    vi.stubGlobal('navigator', {
      languages: [],
      language: 'ru-RU',
    });
    expect(getLocale()).toEqual('nb');
    vi.unstubAllGlobals();
  });

  it('should otherwise return fallback default ', () => {
    vi.stubGlobal('navigator', {
      languages: [],
      language: undefined,
    });
    expect(getLocale()).toEqual('nb');
    vi.unstubAllGlobals();
  });
});
