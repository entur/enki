import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { selectLocale, updateConfiguredLocale } from 'i18n/intlSlice';
import { getMessages } from 'i18n';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useConfig } from '../../../config/ConfigContext';
import { getExtMessages } from './getExtMessages';

/**
 * Main objective of this was to override certain translation values (e.g. appTitle)
 * and use additional translation keys that are relevant only for the custom Fintraffic features;
 *
 * @param children
 * @constructor
 */
export const FintrafficIntlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const { defaultLocale, extPath } = useConfig();
  const selectedLocale = useAppSelector(selectLocale);
  const dispatch = useAppDispatch();
  const deferredMessages = useDeferredValue(messages);
  useEffect(() => {
    if (defaultLocale) {
      dispatch(updateConfiguredLocale(defaultLocale));
    }
  }, [defaultLocale]);

  useEffect(() => {
    getMessages(selectedLocale).then(async (messagesForLocale) => {
      if (extPath) {
        const extMessages = await getExtMessages(extPath, selectedLocale);
        const combinedMessages = {
          ...messagesForLocale,
          ...extMessages,
        } as Record<string, string>;
        setMessages(combinedMessages);
      }
    });
  }, [selectedLocale, extPath]);

  return (
    <Suspense>
      {deferredMessages && (
        <IntlProvider
          locale={selectedLocale}
          messages={deferredMessages}
          defaultLocale={defaultLocale || 'fi'}
        >
          {children}
        </IntlProvider>
      )}
    </Suspense>
  );
};
