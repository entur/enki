import { OidcClientSettings } from 'oidc-client-ts';
import { FlexibleLineType } from '../model/FlexibleLine';
import { Locale } from '../i18n';

/**
 * All sandbox features should be added to this interface like this:
 *  - featureName: boolean;
 *
 *  For multi-level features, only the top-level featureName should be
 *  toggled.
 */
export interface SandboxFeatures {
  /**
   * Fintraffic's custom features or assets grouped in one location;
   * For example: custom styles override, logo component and translations provider.
   */
  Fintraffic: boolean;
  /**
   * Map for editing stop places as part JourneyPattern form
   */
  JourneyPatternStopPointMap: boolean;
}

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
   * Opt-out of authentication features for local development
   */
  disableAuthentication?: boolean;

  /**
   * Disable automatic login redirect
   */
  disableAutomaticLoginRedirect?: boolean;

  /**
   * Prefix used in XML namespace for providers in exported datasets
   */
  xmlnsUrlPrefix?: string;

  /**
   * Optionally restrict available flexible line types available for users to choose from when
   * creating flexible lines.
   */
  supportedFlexibleLineTypes?: FlexibleLineType[];

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

  /**
   * Sandbox feature configuration
   */
  sandboxFeatures?: SandboxFeatures;

  /**
   * Path to folder inder /ext that contains features or assets of a company that adopted Nplan.
   * This is used e.g. for:
   *    CustomStyle, when determining the relevant custom style class;
   *    CustomLogo;
   *    overriding translations (case appTitle)
   */
  extPath?: string;

  hideExportDryRun?: boolean;
}
