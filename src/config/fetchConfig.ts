import { Config } from './ConfigContext';
import { getEnvironment } from './getEnvironment';

export const fetchConfig = async (): Promise<Config> => {
  const env = getEnvironment();
  const { default: config } = await import(`./environments/${env}.json`);
  return config;
};
