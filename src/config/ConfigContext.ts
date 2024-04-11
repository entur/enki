import { FlexibleLineType } from 'model/FlexibleLine';
import { OidcClientSettings } from 'oidc-client-ts';
import { createContext, useContext } from 'react';
import { SandboxFeatures } from './SandboxFeature';

export interface Config {
  uttuApiUrl?: string;
  enableLegacyOrganisationsFilter?: boolean;
  adminRole?: string;
  xmlnsUrlPrefix?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  supportedFlexibleLineTypes?: FlexibleLineType[];
  sandboxFeatures?: SandboxFeatures;
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
