import { IntlProvider } from 'react-intl';

export const TestIntlProvider = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}) => {
  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale={locale}>
      {children}
    </IntlProvider>
  );
};
