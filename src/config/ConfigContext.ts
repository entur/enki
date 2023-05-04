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
  auth0?: {
    domain: string;
    clientId: string;
    audience: string;
    useRefreshTokens: boolean;
    cacheLocation: string;
  };
  oidcConfig?: OidcClientSettings;
  supportedFlexibleLineTypes?: FlexibleLineType[];
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
