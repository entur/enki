import 'moment/locale/nb';
import { IntlShape } from 'react-intl';
import { Messages } from './translations/translationKeys';

export const defaultLocale = 'nb';

export type locale = 'nb' | 'en' | 'sv';

export const SUPPORTED_LOCALES: locale[] = ['nb', 'en', 'sv'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale: locale) =>
  (locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale) as locale;

export const isLocaleSupported = (locale: locale) =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

export const getLocale = () => {
  const savedLocale =
    import.meta.env.NODE_ENV !== 'test' && localStorage.getItem(LOCALE_KEY);
  const navigatorLang =
    import.meta.env.NODE_ENV !== 'test' &&
    ((navigator.languages && navigator.languages[0]) || navigator.language);
  const locale = (savedLocale || navigatorLang || defaultLocale) as locale;
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }
  return defaultLocale;
};

export const getMessages = async (
  locale: locale
): Promise<Record<Messages, string>> => {
  switch (locale) {
    case 'nb':
      return import('./translations/nb') as unknown as Promise<
        Record<Messages, string>
      >;
    case 'en':
      return import('./translations/en') as unknown as Promise<
        Record<Messages, string>
      >;
    case 'sv':
      return import('./translations/sv') as unknown as Promise<
        Record<Messages, string>
      >;
  }
};

export type FormatMessage = IntlShape['formatMessage'];
