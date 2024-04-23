import 'moment/locale/nb';
import { IntlShape } from 'react-intl';
import { Messages } from './translations/translationKeys';
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from './locale';

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

export const getMessages = async (
  locale: Locale,
): Promise<Record<Messages, string>> => {
  return (await import(`./translations/${locale}.ts`)).messages;
};

export type FormatMessage = IntlShape['formatMessage'];

const getUserDefinedLocale = () => {
  return import.meta.env.NODE_ENV !== 'test'
    ? (localStorage.getItem(LOCALE_KEY) as Locale)
    : undefined;
};

const getNavigatorLocale = () => {
  const navigatorLang =
    import.meta.env.NODE_ENV !== 'test'
      ? ((navigator?.languages[0] || navigator.language) as Locale)
      : undefined;

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
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;
