import { createContext, useContext } from 'react';

export interface Config {
  enableLegacyOrganisationsFilter?: boolean;
}

export const ConfigContext = createContext<Config>({});

export const useConfig = () => useContext(ConfigContext);
