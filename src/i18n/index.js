import { IntlProvider } from 'react-intl';
import 'moment/locale/nb';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import { createSelector } from 'reselect';

export const defaultLocale = 'nb';
export const SUPPORTED_LOCALES = ['nb', 'en'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale) =>
  locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale;

export const isLocaleSupported = (locale) =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

const getLocale = () => {
  const savedLocale =
    process.env.NODE_ENV !== 'test' && localStorage.getItem(LOCALE_KEY);
  const navigatorLang =
    process.env.NODE_ENV !== 'test' &&
    ((navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage);
  const locale = savedLocale || navigatorLang || defaultLocale;
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }
  return defaultLocale;
};

export const getMessages = (locale) => require('./translations/' + locale);

/* Basic support for i18n based on default browser language */
export const geti18n = () => {
  const locale = getLocale();
  const messages = getMessages(locale);
  return {
    messages,
    locale,
  };
};

let cachedIntl = null;
let prevLocale = '';

export const getIntl = ({ intl: { locale, messages } }) => {
  if (!cachedIntl || locale !== prevLocale) {
    cachedIntl = new IntlProvider({ locale, messages }).state.intl;
    prevLocale = locale;
  }
  return cachedIntl;
};

export const selectIntl = createSelector(
  (state) => state.intl,
  (intl) => getIntl({ intl })
);
