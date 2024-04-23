import { NorwayIcon, SwedenIcon, UKIcon } from '@entur/icons';
import { MessagesKey } from './translations/translationKeys';

/**
 * This is a last-resort fallback. Default locale is configurable in bootstrap config
 * see `../config/ConfigContext.ts`
 */
export const DEFAULT_LOCALE: Locale = 'nb';

/**
 * When adding new translations, the locale needs to be added to the Locale array.
 */
export const Locale = ['nb', 'en', 'sv'] as const;

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
    default:
      return 'userMenuMenuItemTextNorwegian';
  }
};
