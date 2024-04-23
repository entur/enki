/**
 * This is a last-resort fallback. Default locale is configurable in bootstrap config
 * see `../config/ConfigContext.ts`
 */
export const DEFAULT_LOCALE: Locale = 'nb';

/**
 * When adding new translations, the locale needs to be added to the SUPPORTED_LOCALES array.
 */
export const SUPPORTED_LOCALES = ['nb', 'en', 'sv'] as const;

/**
 * The Locale type is generated from the list of supported locales
 */
export type Locale = (typeof SUPPORTED_LOCALES)[number];
