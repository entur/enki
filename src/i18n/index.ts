import { IntlProvider } from 'react-intl';
import 'moment/locale/nb';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import { MessagesKey } from 'i18n/translations/translationKeys';
import { IntlState } from 'react-intl-redux';
import { GlobalState } from 'reducers';
import { useSelector } from 'react-redux';

export const defaultLocale = 'nb';
export const SUPPORTED_LOCALES: ('nb' | 'en' | 'sv')[] = ['nb', 'en', 'sv'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale: string): 'nb' | 'en' | 'sv' =>
  (locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale) as
    | 'nb'
    | 'en'
    | 'sv';

export const isLocaleSupported = (locale: 'nb' | 'en' | 'sv') =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

const getLocale = () => {
  const savedLocale =
    import.meta.env.NODE_ENV !== 'test' && localStorage.getItem(LOCALE_KEY);
  const navigatorLang =
    import.meta.env.NODE_ENV !== 'test' &&
    ((navigator.languages && navigator.languages[0]) || navigator.language);
  const locale = (savedLocale || navigatorLang || defaultLocale) as
    | 'nb'
    | 'en'
    | 'sv';
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }
  return defaultLocale;
};

export const getMessages = async (locale: 'nb' | 'en' | 'sv') => {
  switch (locale) {
    case 'nb':
      return import('./translations/nb');
    case 'en':
      return import('./translations/en');
    case 'sv':
      return import('./translations/sv');
  }
};

/* Basic support for i18n based on default browser language */
export const geti18n = async () => {
  const locale = getLocale();
  const { messages } = await getMessages(locale as 'nb' | 'en' | 'sv');
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

export const useIntl: () => AppIntlState = () => useSelector(selectIntl);
