import { FlexibleLineType } from 'model/FlexibleLine';
import { Config } from './ConfigContext';
import { getEnvironment } from './getEnvironment';

const defaultConfig: Config = {
  supportedFlexibleLineTypes: Object.values(FlexibleLineType),
};

export const fetchConfig = async (): Promise<Config> => {
  const env = getEnvironment();
  const { default: config } = await import(`./environments/${env}.json`);

  const overrides: Config = {};

  if (import.meta.env.REACT_APP_UTTU_API_URL) {
    overrides.uttuApiUrl = import.meta.env.REACT_APP_UTTU_API_URL;
  }

  return Object.assign({}, defaultConfig, config, overrides);
};
