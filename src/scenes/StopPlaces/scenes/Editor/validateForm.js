import { isNil, isEmpty } from 'ramda';
import { objectIsEmpty } from 'helpers/forms';

import messages from './validateForm.messages';

function validateName(name) {
  if (isNil(name) || isEmpty(name)) {
    return [messages.errorNameEmpty];
  }
  return [];
}

function validateFlexibleArea(flexibleArea) {
  if (isNil(flexibleArea) || flexibleArea.polygon.coordinates.length < 4) {
    return [messages.errorFlexibleAreaNotEnoughPolygons];
  }
  return [];
}

export default function(stopPlace) {
  let errors = {
    name: validateName(stopPlace.name),
    flexibleArea: validateFlexibleArea(stopPlace.flexibleArea)
  };
  return [objectIsEmpty(errors), errors];
}
