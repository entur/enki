import { Configuration } from '@azure/msal-browser';
import { Config } from '../../../config/config';

export interface FintrafficConfig extends Config {
  msalConfig: Configuration;
}
