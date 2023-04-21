import { IntlProvider, IntlShape } from 'react-intl';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLocale } from 'features/app/intlSlice';
import { getMessages } from 'i18n';

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
