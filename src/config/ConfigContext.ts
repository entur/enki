import { createContext, useContext } from 'react';

export interface Config {
  enableLegacyOrganisationsFilter?: boolean;
  adminRole?: string;
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
