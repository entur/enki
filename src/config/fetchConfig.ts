import { FlexibleLineType } from 'model/FlexibleLine';

import { Config } from './config';

const defaultConfig: Config = {
  supportedFlexibleLineTypes: Object.values(FlexibleLineType),
};

export const fetchConfig = async (): Promise<Config> => {
  const overrides: Config = {};

  if (import.meta.env.VITE_REACT_APP_UTTU_API_URL) {
    overrides.uttuApiUrl = import.meta.env.VITE_REACT_APP_UTTU_API_URL;
  }
  let input = '/bootstrap.json';
  if (import.meta.env.BASE_URL) {
    input = import.meta.env.BASE_URL + input;
  }
  const response = await fetch(input);
  const config: Config = await response.json();

  return Object.assign({}, defaultConfig, config, overrides);
};
