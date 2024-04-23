import { FlexibleLineType } from 'model/FlexibleLine';
import { OidcClientSettings } from 'oidc-client-ts';
import { createContext, useContext } from 'react';

import { Locale } from '../i18n/locale';

export interface Config {
  /**
   * Base URL for backend GraphQL API (a.k.a. uttu)
   *
   * Note that uttu has multiple GraphQL endpoints, one for each
   * provider and additionally one for the providers API.
   */
  uttuApiUrl?: string;

  /**
   * Configure OpenID Connect for authenticating users with a compliant authentication provider
   *
   * {@see https://authts.github.io/oidc-client-ts/interfaces/OidcClientSettings.html}
   */
  oidcConfig?: OidcClientSettings;

  /**
   * Prefix used in XML namespace for providers in exported datasets
   */
  xmlnsUrlPrefix?: string;

  /**
   * Enables Entur specific legacy bevaior for filtering authorities and operators.
   * {@see ../model/Organisation.ts}
   */
  enableLegacyOrganisationsFilter?: boolean;

  /**
   * Optionally restrict available flexible line types available for users to choose from when
   * creating flexible lines.
   */
  supportedFlexibleLineTypes?: FlexibleLineType[];

  /**
   * The exact shape of the admin role used to match against role claims in token, toggles
   * visibility of providers admin menu option.
   *
   * This is technical debt, and will be moved to the backend
   */
  adminRole?: string;

  /**
   * Namespace for preferred name in tokens
   *
   * This is technical debt, and will be moved to the backend
   */
  preferredNameNamespace?: string;

  /**
   * Namespace for claims in tokens
   *
   * This is technical debt, and will be moved to the backend
   */
  claimsNamespace?: string;

  /**
   * Optional DSN for sentry configuration. If not present, Sentry will not be configured
   * {@see https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/}
   */
  sentryDSN?: string;

  /**
   * Default locale to use for translations and formatting
   */
  defaultLocale?: Locale;

  /**
   * Optionally restrict the choice of locales to the user
   */
  supportedLocales?: Locale[];
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
