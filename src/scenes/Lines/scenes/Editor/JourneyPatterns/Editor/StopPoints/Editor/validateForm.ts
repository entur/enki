import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import messages from './validateForm.messages';
import { StopPoint } from 'model';
import { StopPointsFormError } from './index';

export const validateStopPoints = (stopPoints: StopPoint[]): boolean =>
  getStopPointsErrors(stopPoints).every(stopPointErrors =>
    objectValuesAreEmpty(stopPointErrors)
  );

export const getStopPointsErrors = (
  stopPoints: StopPoint[]
): StopPointsFormError[] =>
  stopPoints.map((stopPoint, index) =>
    validateStopPoint(stopPoint, index === 0)
  );

export const validateStopPoint = (
  stopPoint: StopPoint,
  isFirst: boolean
): StopPointsFormError => {
  const { quayRef, flexibleStopPlaceRef, destinationDisplay } = stopPoint;

  const getFlexibleStopPlaceRefAndQuayRefError = () => {
    if (isBlank(quayRef) && !flexibleStopPlaceRef)
      return messages.errorFlexibleStopPlaceRefAndQuayRefNoValues;
    if (!isBlank(quayRef) && flexibleStopPlaceRef)
      return messages.errorFlexibleStopPlaceRefAndQuayRefBothValues;
    return undefined;
  };

  const getFrontTextError = () => {
    if (isFirst && isBlank(destinationDisplay?.frontText))
      return messages.errorFrontTextNoValue;
    return undefined;
  };

  return {
    flexibleStopPlaceRefAndQuayRef: getFlexibleStopPlaceRefAndQuayRefError(),
    frontText: getFrontTextError()
  };
};
