import { selectLocale } from 'features/app/intlSlice';
import { getMessages } from 'i18n';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';

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
