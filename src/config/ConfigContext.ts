import { createContext, useContext } from 'react';
import { Config } from './config';

export const ConfigContext = createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
