import { NorwayIcon, SwedenIcon, UKIcon } from '@entur/icons';
import { MessagesKey } from './translationKeys';

/**
 * This is a last-resort fallback. Default locale is configurable in bootstrap config
 * see `../config/ConfigContext.ts`
 */
export const DEFAULT_LOCALE: Locale = 'nb';

/**
 * When adding new translations, the locale needs to be added to the Locale array.
 */
export const Locale = ['nb', 'en', 'sv', 'fi'] as const;

/**
 * The Locale type is generated from the list of supported locales
 */
export type Locale = (typeof Locale)[number];

export const getLanguagePickerFlagIcon = (locale: Locale) => {
  switch (locale) {
    case 'nb':
      return <NorwayIcon inline />;
    case 'sv':
      return <SwedenIcon inline />;
    case 'en':
      return <UKIcon inline />;
    case 'fi':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 18 11"
        >
          <rect width="18" height="11" fill="#fff" />
          <path d="M0,5.5h18M6.5,0v11" stroke="#002F6C" stroke-width="3" />
        </svg>
      );
    default: {
      return <NorwayIcon inline />;
    }
  }
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
    default:
      return 'userMenuMenuItemTextNorwegian';
  }
};
