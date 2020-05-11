import { IntlProvider } from 'react-intl';
import 'moment/locale/nb';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import { MessagesKey } from 'i18n/translations/translationKeys';
import { IntlState } from 'react-intl-redux';
import { GlobalState } from 'reducers';

export const defaultLocale = 'nb';
export const SUPPORTED_LOCALES = ['nb', 'en'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale: string) =>
  locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale;

export const isLocaleSupported = (locale: string) =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

const getLocale = () => {
  const savedLocale =
    process.env.NODE_ENV !== 'test' && localStorage.getItem(LOCALE_KEY);
  const navigatorLang =
    process.env.NODE_ENV !== 'test' &&
    ((navigator.languages && navigator.languages[0]) || navigator.language);
  const locale = savedLocale || navigatorLang || defaultLocale;
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }
  return defaultLocale;
};

export const getMessages = (locale: string) =>
  require('./translations/' + locale + '.ts');

/* Basic support for i18n based on default browser language */
export const geti18n = () => {
  const locale = getLocale();
  const { messages } = getMessages(locale);
  return {
    messages,
    locale,
  };
};

export type FormatMessage = (
  messageId: keyof MessagesKey,
  details?: string
) => string;

export type AppIntlState = IntlState & {
  formatMessage: FormatMessage;
};

let cachedIntl: any = null;
let prevLocale = '';

export const getIntl = ({ intl: { locale, messages } }: any): AppIntlState => {
  if (!cachedIntl || locale !== prevLocale) {
    const intlProvider = new IntlProvider({ locale, messages }).state.intl;
    cachedIntl = {
      ...intlProvider,
      formatMessage: (messageId: keyof MessagesKey, details?: string) =>
        details
          ? intlProvider!.formatMessage({ id: messageId }, { details: details })
          : intlProvider!.formatMessage({ id: messageId }),
    };
    prevLocale = locale;
  }
  return cachedIntl;
};

export const selectIntl = (state: GlobalState) => getIntl({ intl: state.intl });
