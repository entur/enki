import {hasValue, objectValues} from '../../../../../../../../helpers/forms';
import searchForQuay from './searchForQuay';
import messages from './validateForm.messages';

export default async function (stopPoint, stopPointIndex) {
  let errors = { quayRef: [], flexibleStopPlaceRefAndQuayRef: [], frontText: [] };
  let { quayRef, flexibleStopPlaceRef, destinationDisplay } = stopPoint;

  if (!flexibleStopPlaceRef && !hasValue(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push(messages.errorFlexibleStopPlaceRefAndQuayRefNoValues);
  } else if (flexibleStopPlaceRef && hasValue(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push(messages.errorFlexibleStopPlaceRefAndQuayRefBothValues);
  } else if (hasValue(quayRef)) {
    let quaySearch = await searchForQuay(quayRef);
    if (!quaySearch.quay.id) {
      errors.quayRef.push(messages.errorQuayRefInvalid);
    }
  } else if (stopPointIndex === 0 && (!destinationDisplay || !hasValue(destinationDisplay.frontText))) {
    errors.frontText.push(messages.errorFrontTextNoValue);
  }
  return [objectValues(errors).length === 0, errors];
}
