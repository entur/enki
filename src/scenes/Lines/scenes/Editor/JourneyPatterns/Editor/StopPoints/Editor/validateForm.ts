import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import { StopPointsFormError } from './index';
import StopPoint from 'model/StopPoint';
import { MessagesKey } from 'i18n/translations/translationKeys';
import JourneyPattern from 'model/JourneyPattern';

export const validJourneyPattern = (
  journeyPatterns?: JourneyPattern[]
): boolean =>
  !!journeyPatterns &&
  !isBlank(journeyPatterns[0].name) &&
  validateStopPoints(journeyPatterns[0].pointsInSequence ?? []);

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
    flexibleStopPlaceRef,
    destinationDisplay,
    forAlighting,
    forBoarding,
  } = stopPoint;

  const getFlexibleStopPlaceRefAndQuayRefError = ():
    | keyof MessagesKey
    | undefined => {
    if (isBlank(quayRef) && !flexibleStopPlaceRef)
      return 'flexibleStopPlaceRefAndQuayRefNoValues';
    if (!isBlank(quayRef) && flexibleStopPlaceRef)
      return 'flexibleStopPlaceRefAndQuayRefBothValues';
    return undefined;
  };

  const getFrontTextError = (): keyof MessagesKey | undefined => {
    if (isFirst && isBlank(destinationDisplay?.frontText))
      return 'frontTextNoValue';
    return undefined;
  };

  const getBoardingError = (): keyof MessagesKey | undefined => {
    if (isFirst && forAlighting) return 'frontTextAlighting';
    if (isLast && forBoarding) return 'frontTextBoarding';
    return undefined;
  };

  return {
    flexibleStopPlaceRefAndQuayRef: getFlexibleStopPlaceRefAndQuayRefError(),
    frontText: getFrontTextError(),
    boarding: getBoardingError(),
  };
};
