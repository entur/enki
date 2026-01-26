import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import { MessagesKey } from 'i18n/translationKeys';
import StopPoint from 'model/StopPoint';

export type StopPointsFormError = {
  stopPlace: keyof MessagesKey | undefined;
  frontText: keyof MessagesKey | undefined;
  boarding: keyof MessagesKey | undefined;
};

export const validateStopPoint = (
  stopPoint: StopPoint,
  isFirst: boolean,
  isLast: boolean,
): StopPointsFormError => {
  const {
    quayRef,
    flexibleStopPlaceRef,
    destinationDisplay,
    forAlighting,
    forBoarding,
  } = stopPoint;

  const getStopPlaceError = (): keyof MessagesKey | undefined => {
    if (isBlank(quayRef) && isBlank(flexibleStopPlaceRef))
      return 'flexibleStopPlaceRefAndQuayRefNoValues';
    return undefined;
  };

  const getFrontTextError = (): keyof MessagesKey | undefined => {
    if (isFirst && isBlank(destinationDisplay?.frontText))
      return 'frontTextNoValue';
    return undefined;
  };

  const getBoardingError = (): keyof MessagesKey | undefined => {
    if (isFirst && (forAlighting || !forBoarding)) return 'frontTextAlighting';
    if (isLast && (forBoarding || !forAlighting)) return 'frontTextBoarding';
    return undefined;
  };

  return {
    stopPlace: getStopPlaceError(),
    frontText: getFrontTextError(),
    boarding: getBoardingError(),
  };
};

export const validateFlexibleAreasOnlyStopPoint = (
  stopPoint: StopPoint,
  isFirst?: boolean,
): StopPointsFormError => {
  const { flexibleStopPlaceRef, destinationDisplay } = stopPoint;

  const getStopPlaceError = (): keyof MessagesKey | undefined => {
    if (!flexibleStopPlaceRef) return 'flexibleStopPlaceRefAndQuayRefNoValues';
    return undefined;
  };

  const getFrontTextError = (): keyof MessagesKey | undefined => {
    if (isFirst && isBlank(destinationDisplay?.frontText))
      return 'frontTextNoValue';
    return undefined;
  };

  return {
    stopPlace: getStopPlaceError(),
    frontText: getFrontTextError(),
    boarding: undefined,
  };
};

export const getStopPointsErrors = (
  stopPoints: StopPoint[],
): StopPointsFormError[] =>
  stopPoints.map((stopPoint, index) =>
    validateStopPoint(stopPoint, index === 0, index === stopPoints.length - 1),
  );

export const getFlexibleAreasOnlyStopPointsErrors = (
  stopPoints: StopPoint[],
): StopPointsFormError[] =>
  stopPoints.map((stopPoint, index) =>
    validateFlexibleAreasOnlyStopPoint(stopPoint, index === 0),
  );

export const validateStopPoints = (stopPoints: StopPoint[]): boolean =>
  stopPoints.length >= 2 &&
  getStopPointsErrors(stopPoints).every((stopPointErrors) =>
    objectValuesAreEmpty(stopPointErrors),
  );

export const validateFlexibleAreasOnlyStopPoints = (
  stopPoints: StopPoint[],
): boolean =>
  getFlexibleAreasOnlyStopPointsErrors(stopPoints).every((stopPointErrors) =>
    objectValuesAreEmpty(stopPointErrors),
  );
