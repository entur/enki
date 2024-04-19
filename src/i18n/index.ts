import 'moment/locale/nb';
import { IntlShape } from 'react-intl';
import { Messages } from './translations/translationKeys';

export const defaultLocale = 'nb';

export type locale = 'nb' | 'en' | 'sv';

export const SUPPORTED_LOCALES: locale[] = ['nb', 'en', 'sv'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale?: locale) =>
  (locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale) as locale;

export const isLocaleSupported = (locale: locale) =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

export const getLocale = () => {
  return import.meta.env.NODE_ENV !== 'test'
    ? (localStorage.getItem(LOCALE_KEY) as locale)
    : undefined;
};

export const getNavigatorLocale = () => {
  const navigatorLang =
    import.meta.env.NODE_ENV !== 'test'
      ? (((navigator.languages && navigator.languages[0]) ||
          navigator.language) as locale)
      : undefined;

  return supportedLocale(navigatorLang);
};

const supportedLocale = (locale?: locale) => {
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }

  return locale;
};

export const getMessages = async (
  locale: locale,
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
