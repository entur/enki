import { DEFAULT_LOCALE, Locale } from './locale';

export const LOCALE_KEY = 'OT::locale';

export const getLocale = (configuredDefaultLocale?: Locale) => {
  let locale = getUserDefinedLocale();

  if (!locale && configuredDefaultLocale) {
    locale = configuredDefaultLocale;
  }

  if (!locale) {
    locale = getNavigatorLocale();
  }

  if (!locale) {
    locale = DEFAULT_LOCALE;
  }

  return locale;
};

const getUserDefinedLocale = () => {
  return localStorage.getItem(LOCALE_KEY) as Locale | undefined;
};

const getNavigatorLocale = () => {
  const navigatorLang = navigator?.languages[0] || navigator.language;

  return supportedLocale(navigatorLang);
};

const supportedLocale = (locale?: string) => {
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }

  return undefined;
};

const removeRegionCode = (locale?: string) =>
  locale ? (locale.toLowerCase().split(/[_-]+/)[0] as Locale) : undefined;

const isLocaleSupported = (locale?: Locale) =>
  locale ? Locale.indexOf(locale) > -1 : false;
