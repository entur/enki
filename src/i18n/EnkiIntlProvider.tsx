import { selectLocale, updateConfiguredLocale } from 'features/app/intlSlice';
import { getMessages } from 'i18n';
import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useAppSelector } from '../app/hooks';
import { useConfig } from '../config/ConfigContext';
import { useAppDispatch } from '../app/hooks';

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
      {deferredMessages !== null && (
        <IntlProvider
          locale={selectedLocale}
          messages={deferredMessages}
          defaultLocale="nb"
        >
          {children}
        </IntlProvider>
      )}
    </Suspense>
  );
};
