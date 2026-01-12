import { MessagesKey } from './translationKeys';
import bgFlag from 'flag-icons/flags/4x3/bg.svg?url';
import fiFlag from 'flag-icons/flags/4x3/fi.svg?url';
import gbFlag from 'flag-icons/flags/4x3/gb.svg?url';
import noFlag from 'flag-icons/flags/4x3/no.svg?url';
import seFlag from 'flag-icons/flags/4x3/se.svg?url';
/**
 * This is a last-resort fallback. Default locale is configurable in bootstrap config
 * see `../config/ConfigContext.ts`
 */
export const DEFAULT_LOCALE: Locale = 'nb';

/**
 * When adding new translations, the locale needs to be added to the Locale array.
 */
export const Locale = ['nb', 'en', 'sv', 'fi', 'bg'] as const;

/**
 * The Locale type is generated from the list of supported locales
 */
export type Locale = (typeof Locale)[number];

const getFlagUrl = (locale: Locale): string => {
  switch (locale) {
    case 'nb':
      return noFlag;
    case 'en':
      return gbFlag;
    case 'sv':
      return seFlag;
    case 'fi':
      return fiFlag;
    case 'bg':
      return bgFlag;
    default:
      return gbFlag; // fallback
  }
};

export const getLanguagePickerFlagIcon = async (locale: Locale) => {
  const flagUrl = getFlagUrl(locale);

  return ({ className }: { className?: string }) => (
    <img
      src={flagUrl}
      alt={`${locale} flag`}
      className={className}
      style={{ width: '1.5em', height: '1em' }}
    />
  );
};
export const getLanguagePickerLocaleMessageKey = (
  locale: Locale,
): keyof MessagesKey => {
  switch (locale) {
    case 'en':
      return 'userMenuMenuItemTextEnglish';
    case 'sv':
      return 'userMenuMenuItemTextSwedish';
    case 'nb':
      return 'userMenuMenuItemTextNorwegian';
    case 'fi':
      return 'userMenuMenuItemTextFinnish';
    case 'bg':
      return 'userMenuMenuItemTextBulgarian';
    default:
      return 'userMenuMenuItemTextNorwegian';
  }
};
