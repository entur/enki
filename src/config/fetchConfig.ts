import { Config } from './ConfigContext';
import { getEnvironment } from './getEnvironment';

export const fetchConfig = async (): Promise<Config> => {
  const env = getEnvironment();
  const { default: config } = await import(`./environments/${env}.json`);

  const overrides: Config = {};

  if (process.env.REACT_APP_UTTU_API_URL) {
    overrides.uttuApiUrl = process.env.REACT_APP_UTTU_API_URL;
  }

  return Object.assign({}, config, overrides);
};
