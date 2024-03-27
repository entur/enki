import { selectLocale } from 'features/app/intlSlice';
import { getMessages } from 'i18n';
import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useAppSelector } from '../app/hooks';

export const EnkiIntlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<Record<string, string> | null>(null);
  const locale = useAppSelector(selectLocale);
  const deferredMessages = useDeferredValue(messages);

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
