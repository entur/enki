import * as R from 'ramda';
import { DEFAULT_SELECT_VALUE } from './constants';
import { objectValues } from './helpers';

function validateNetworkRef(networkRef) {
  if (R.isNil(networkRef) || networkRef === DEFAULT_SELECT_VALUE || R.isEmpty(networkRef)) {
    return ['error.flexibleLine.networkRef.empty'];
  }
  return [];
}

export default function (flexibleLine) {
  let errors = {
    networkRef: validateNetworkRef(flexibleLine.networkRef)
  };
  return [objectValues(errors).length === 0, errors];
}