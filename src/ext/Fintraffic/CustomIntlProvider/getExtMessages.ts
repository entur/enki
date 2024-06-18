import { Locale } from '../../../i18n';
import { ExtMessages } from './translations/translationKeys';

/**
 * Getting translation overrides or additional translations related specifically to external company that adopted Nplan
 * @param extPath
 * @param locale
 */
export const getExtMessages = async (
  extPath: string,
  locale: Locale,
): Promise<Record<ExtMessages, string>> => {
  return (await import(`./translations/${locale}.ts`)).messages;
};
