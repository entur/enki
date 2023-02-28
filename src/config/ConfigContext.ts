import { FlexibleLineType } from 'model/FlexibleLine';
import { createContext, useContext } from 'react';

export interface Config {
  uttuApiUrl?: string;
  enableLegacyOrganisationsFilter?: boolean;
  adminRole?: string;
  xmlnsUrlPrefix?: string;
  claimsNamespace?: string;
  sentryDsn?: string;
  auth0?: {
    domain: string;
    clientId: string;
    audience: string;
    useRefreshTokens: boolean;
    cacheLocation: string;
  };
  supportedFlexibleLineTypes?: FlexibleLineType[];
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
