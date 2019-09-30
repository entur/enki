import {hasValue, objectValues} from '../../../../helpers';
import searchForQuay from './searchForQuay';

export default async function (stopPoint) {
  let errors = { quayRef: [], flexibleStopPlaceRefAndQuayRef: [], frontText: [] };
  let { quayRef, flexibleStopPlaceRef, destinationDisplay } = stopPoint;

  if (!flexibleStopPlaceRef && !hasValue(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push('error.flexibleStopPlaceRefAndQuayRef.noValues');
  } else if (flexibleStopPlaceRef && hasValue(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push('error.flexibleStopPlaceRefAndQuayRef.bothValues');
  } else if (hasValue(quayRef)) {
    let quaySearch = await searchForQuay(quayRef);
    if (!quaySearch.quay.id) {
      errors.quayRef.push('error.quayRef.invalid');
    }
  } else if (!destinationDisplay || !hasValue(destinationDisplay.frontText)) {
    errors.frontText.push('error.frontText.noValue');
  }
  return [objectValues(errors).length === 0, errors];
}
