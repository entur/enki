/* Initial state is initialized in ../store.js */

import { Config } from 'config/ConfigContext';
import { AnyAction } from 'redux';

export type ConfigState = Config;

const configReducer = (
  state: ConfigState = {},
  action: AnyAction
): ConfigState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default configReducer;
