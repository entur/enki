import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import messages from './validateForm.messages';
import { StopPoint } from 'model';
import { StopPointsFormError } from './index';

export default function(
  stopPoint: StopPoint,
  isFirst: boolean
): [boolean, StopPointsFormError] {
  let errors: StopPointsFormError = {
    quayRef: [],
    flexibleStopPlaceRefAndQuayRef: [],
    frontText: []
  };
  const { quayRef, flexibleStopPlaceRef, destinationDisplay } = stopPoint;

  if (!flexibleStopPlaceRef && isBlank(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push(
      messages.errorFlexibleStopPlaceRefAndQuayRefNoValues
    );
  } else if (flexibleStopPlaceRef && !isBlank(quayRef)) {
    errors.flexibleStopPlaceRefAndQuayRef.push(
      messages.errorFlexibleStopPlaceRefAndQuayRefBothValues
    );
  } else if (
    isFirst &&
    (!destinationDisplay || isBlank(destinationDisplay.frontText))
  ) {
    errors.frontText.push(messages.errorFrontTextNoValue);
  }

  return [objectValuesAreEmpty(errors), errors];
}
