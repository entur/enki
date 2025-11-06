import { OidcClientSettings } from 'oidc-client-ts';
import { FlexibleLineType } from '../model/FlexibleLine';
import { Locale } from '../i18n';
import { VEHICLE_MODE } from '../model/enums';

/**
 * All sandbox features should be added to this interface like this:
 *  - featureName: boolean;
 *
 *  For multi-level features, only the top-level featureName should be
 *  toggled.
 */
export interface SandboxFeatureConfig {
  /**
   * Fintraffic's custom features or assets grouped in one location;
   * For example: custom styles override, logo component and translations provider.
   */
  Fintraffic: boolean;
  /**
   * Map for editing stop places as part JourneyPattern form
   */
  JourneyPatternStopPointMap: boolean;
  /**
   * Matomo web analytics
   */
  MatomoTracker: boolean;
  /**
   * Cookie consent management provider
   */
  CookieInformation: boolean;
  /**
   * Enable supported tiles
   */
  MapTiles: boolean;
}

export type SandboxFeatures = keyof SandboxFeatureConfig;

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
  sandboxFeatures?: SandboxFeatureConfig;

  /**
   * Path to folder inder /ext that contains features or assets of a company that adopted Nplan.
   * This is used e.g. for:
   *    CustomStyle, when determining the relevant custom style class;
   *    CustomLogo;
   *    overriding translations (case appTitle)
   */
  extPath?: string;

  /**
   * If true, the "dry run" option in create export page will not be visible
   */
  hideExportDryRun?: boolean;

  /**
   * Supported modes for calculating route geometry
   */
  routeGeometrySupportedVehicleModes?: VEHICLE_MODE[];

  /**
   * Default value for the checkbox-option to generate service links on export
   * **Note that if not provided, the default is "true".**
   */
  exportGenerateServiceLinksDefault?: boolean;

  /**
   * If the generate service links checkbox on export should be enabled.
   */
  disableGenerateServiceLinksCheckbox?: boolean;

  exportIncludeDatedServiceJourneysDefault?: boolean;

  disableIncludeDatedServiceJourneysCheckbox?: false;

  /**
   * Supported line modes
   */
  lineSupportedVehicleModes?: VEHICLE_MODE[];

  /**
   * Make public code on line optional
   */
  optionalPublicCodeOnLine?: boolean;

  /**
   * The maximum number of stop places that can be fetched for the journey pattern map
   */
  journeyPatternMapStopPlacesLimit?: number;

  /**
   * Provide a way to define custom map provider's details, for example the tile layer or map center/zoom
   */
  mapConfig?: MapConfig;

  /**
   * Enable line migration feature for moving lines between providers
   */
  enableLineMigration?: boolean;
}

export interface MapConfig {
  tileLayers: TileLayer[];
  defaultTileLayer: string;
  center?: [number, number];
  zoom?: number;
}

export interface TileLayerConfig {
  name: string;
  attribution: string;
  url: string;
}
/**
 * Represents a map tile layer configuration.
 */
export interface TileLayer {
  name: string;
  attribution?: string;
  url?: string;
  maxZoom?: number;
  component?: boolean;
  componentName?: string;
  tms?: boolean;
}
