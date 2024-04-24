import { FlexibleLineType } from 'model/FlexibleLine';
import { Config } from './ConfigContext';

const defaultConfig: Config = {
  supportedFlexibleLineTypes: Object.values(FlexibleLineType),
};

export const fetchConfig = async (): Promise<Config> => {
  const overrides: Config = {};

  if (import.meta.env.REACT_APP_UTTU_API_URL) {
    overrides.uttuApiUrl = import.meta.env.REACT_APP_UTTU_API_URL;
  }

  const response = await fetch('/bootstrap.json');
  const config: Config = await response.json();

  return Object.assign({}, defaultConfig, config, overrides);
};
