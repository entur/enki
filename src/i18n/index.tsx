import { IntlProvider, IntlShape } from 'react-intl';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLocale } from 'features/app/intlSlice';
import 'moment/locale/nb';

export const defaultLocale = 'nb';
export const SUPPORTED_LOCALES = ['nb', 'en', 'sv'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale: string) =>
  locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale;

export const isLocaleSupported = (locale: string) =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

export const getLocale = () => {
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
  require('./translations/' + locale + '.ts').messages;

export type FormatMessage = IntlShape['formatMessage'];

export const EnkiIntlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const locale = useSelector(selectLocale);
  const messages = useMemo(() => getMessages(locale), [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="nb">
      {children}
    </IntlProvider>
  );
};
