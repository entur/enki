import { Config } from '../../config/config';

export interface MatomoConfig extends Config {
  matomo: {
    src: string;
  };
}
