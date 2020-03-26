import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import messages from './validateForm.messages';
import { StopPointsFormError } from './index';
import StopPoint from 'model/StopPoint';

export const validateStopPoints = (stopPoints: StopPoint[]): boolean =>
  getStopPointsErrors(stopPoints).every((stopPointErrors) =>
    objectValuesAreEmpty(stopPointErrors)
  );

export const getStopPointsErrors = (
  stopPoints: StopPoint[]
): StopPointsFormError[] =>
  stopPoints.map((stopPoint, index) =>
    validateStopPoint(stopPoint, index === 0, index === stopPoints.length - 1)
  );

export const validateStopPoint = (
  stopPoint: StopPoint,
  isFirst: boolean,
  isLast: boolean
): StopPointsFormError => {
  const {
    quayRef,
    flexibleStopPlace,
    flexibleStopPlaceRef,
    destinationDisplay,
    forAlighting,
    forBoarding,
  } = stopPoint;

  const getFlexibleStopPlaceRefAndQuayRefError = () => {
    if (isBlank(quayRef) && !(flexibleStopPlaceRef ?? flexibleStopPlace?.id))
      return messages.errorFlexibleStopPlaceRefAndQuayRefNoValues;
    if (!isBlank(quayRef) && (flexibleStopPlaceRef ?? flexibleStopPlace?.id))
      return messages.errorFlexibleStopPlaceRefAndQuayRefBothValues;
    return undefined;
  };

  const getFrontTextError = () => {
    if (isFirst && isBlank(destinationDisplay?.frontText))
      return messages.errorFrontTextNoValue;
    return undefined;
  };

  const getBoardingError = () => {
    if (isFirst && forAlighting) return messages.errorAlighting;
    if (isLast && forBoarding) return messages.errorBoarding;
    return undefined;
  };

  return {
    flexibleStopPlaceRefAndQuayRef: getFlexibleStopPlaceRefAndQuayRefError(),
    frontText: getFrontTextError(),
    boarding: getBoardingError(),
  };
};
