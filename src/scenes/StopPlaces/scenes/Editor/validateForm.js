import * as R from 'ramda';
import { objectValues } from '../../../../helpers/forms';

import messages from './validateForm.messages';

function validateName(name) {
  if (R.isNil(name) || R.isEmpty(name)) {
    return [messages.errorNameEmpty];
  }
  return [];
}

function validateFlexibleArea(flexibleArea) {
  if (R.isNil(flexibleArea) || flexibleArea.polygon.coordinates.length < 4) {
    return [messages.errorFlexibleAreaNotEnoughPolygons];
  }
  return [];
}

export default function (stopPlace) {
  let errors = {
    name: validateName(stopPlace.name),
    flexibleArea: validateFlexibleArea(stopPlace.flexibleArea)
  };
  return [objectValues(errors).length === 0, errors];
}
