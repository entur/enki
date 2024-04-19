import { selectLocale } from 'features/app/intlSlice';
import { getMessages, getNavigatorLocale } from 'i18n';
import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useAppSelector } from '../app/hooks';
import { useConfig } from '../config/ConfigContext';

export const EnkiIntlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<Record<string, string> | null>(null);
  const { defaultLocale } = useConfig();
  const selectedLocale = useAppSelector(selectLocale);
  const deferredMessages = useDeferredValue(messages);

  const locale = selectedLocale || defaultLocale || getNavigatorLocale();

  useEffect(() => {
    getMessages(locale).then((messages) => {
      setMessages(() => messages);
    });
  }, [locale]);

  return (
    <Suspense>
      {deferredMessages !== null && (
        <IntlProvider
          locale={locale}
          messages={deferredMessages}
          defaultLocale="nb"
        >
          {children}
        </IntlProvider>
      )}
    </Suspense>
  );
};
