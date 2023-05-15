import { FlexibleLineType } from 'model/FlexibleLine';
import { OidcClientSettings } from 'oidc-client-ts';
import { createContext, useContext } from 'react';

export interface Config {
  uttuApiUrl?: string;
  enableLegacyOrganisationsFilter?: boolean;
  adminRole?: string;
  xmlnsUrlPrefix?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  supportedFlexibleLineTypes?: FlexibleLineType[];
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
