import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import messages from './validateForm.messages';
import { StopPoint } from 'model';
import { QuaySearch } from './searchForQuay';
import { StopPointsFormError } from './index';

export default function(
  stopPoint: StopPoint,
  isFirst: boolean,
  quaySearch: QuaySearch | undefined
): [boolean, StopPointsFormError] {
  let errors: StopPointsFormError = {
    quayRef: [],
    flexibleStopPlaceRefAndQuayRef: [],
    frontText: []
  };
  let { quayRef, flexibleStopPlaceRef, destinationDisplay } = stopPoint;

  if (!flexibleStopPlaceRef && isBlank(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push(
      messages.errorFlexibleStopPlaceRefAndQuayRefNoValues
    );
  } else if (flexibleStopPlaceRef && !isBlank(quayRef)) {
    console.log(flexibleStopPlaceRef, quayRef);
    errors.flexibleStopPlaceRefAndQuayRef.push(
      messages.errorFlexibleStopPlaceRefAndQuayRefBothValues
    );
  } else if (!isBlank(quayRef)) {
    if (!quaySearch?.quay?.id) {
      errors.quayRef.push(messages.errorQuayRefInvalid);
    }
  } else if (
    isFirst &&
    (!destinationDisplay || isBlank(destinationDisplay.frontText))
  ) {
    errors.frontText.push(messages.errorFrontTextNoValue);
  }
  return [objectValuesAreEmpty(errors), errors];
}
