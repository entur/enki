import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { selectLocale, updateConfiguredLocale } from 'i18n/intlSlice';
import { getMessages } from 'i18n';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useConfig } from '../config/ConfigContext';
import { getExtMessages } from './getMessages';

export const EnkiIntlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<Record<string, string> | null>(null);
  const { defaultLocale, partnerCompany } = useConfig();
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
      if (partnerCompany) {
        getExtMessages(partnerCompany, selectedLocale)
          .then((extMessages) => {
            const combinedMessages = {
              ...messages,
              ...extMessages,
            };
            setMessages(() => combinedMessages);
          })
          .catch();
      }
    });
  }, [selectedLocale, partnerCompany]);

  return (
    <Suspense>
      {deferredMessages !== null && (
        <IntlProvider
          locale={selectedLocale}
          messages={messages}
          defaultLocale={defaultLocale || 'nb'}
        >
          {children}
        </IntlProvider>
      )}
    </Suspense>
  );
};
