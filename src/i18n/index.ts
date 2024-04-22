import 'moment/locale/nb';
import { IntlShape } from 'react-intl';
import { Messages } from './translations/translationKeys';

const DEFAULT_LOCALE: Locale = 'nb';

export type Locale = 'nb' | 'en' | 'sv';

export const SUPPORTED_LOCALES: Locale[] = ['nb', 'en', 'sv'];

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
  switch (locale) {
    case 'nb':
      return (await import('./translations/nb')).messages;
    case 'en':
      return (await import('./translations/en')).messages;
    case 'sv':
      return (await import('./translations/sv')).messages;
  }
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
