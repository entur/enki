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
  const navigatorLang = (navigator?.languages[0] ||
    navigator.language) as Locale;

  return supportedLocale(navigatorLang);
};

const supportedLocale = (locale?: Locale) => {
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }

  return locale;
};

const removeRegionCode = (locale?: Locale) =>
  (locale ? locale.toLowerCase().split(/[_-]+/)[0] : DEFAULT_LOCALE) as Locale;

const isLocaleSupported = (locale: Locale) =>
  locale ? Locale.indexOf(locale) > -1 : false;
