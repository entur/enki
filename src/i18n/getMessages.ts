import { IntlShape } from 'react-intl';
import { Locale } from './locale';
import { Messages } from './translations/translationKeys';

export const getMessages = async (
  locale: Locale,
): Promise<Record<Messages, string>> => {
  return (await import(`./translations/${locale}.ts`)).messages;
};

export type FormatMessage = IntlShape['formatMessage'];
