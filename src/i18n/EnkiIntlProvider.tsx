import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { selectLocale, updateConfiguredLocale } from 'i18n/intlSlice';
import { getMessages } from 'i18n';
import { useAppSelector, useAppDispatch } from '../store/hooks';
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (defaultLocale) {
      dispatch(updateConfiguredLocale(defaultLocale));
    }
  }, [defaultLocale]);

  useEffect(() => {
    getMessages(selectedLocale).then((messages) => {
      setMessages(() => messages);
    });
  }, [selectedLocale]);

  return (
    <Suspense>
      {deferredMessages && (
        <IntlProvider
          locale={selectedLocale}
          messages={deferredMessages}
          defaultLocale={defaultLocale || 'nb'}
        >
          {children}
        </IntlProvider>
      )}
    </Suspense>
  );
};
