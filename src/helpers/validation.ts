import {
  addDays,
  getDay,
  isAfter as isDateAfter,
  isEqual as isDateEqual,
  parseISO,
} from 'date-fns';
import { isBlank, objectValuesAreEmpty } from 'helpers/forms';
import { MessagesKey } from 'i18n/translationKeys';
import BookingArrangement from 'model/BookingArrangement';
import DayType from 'model/DayType';
import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import Line from 'model/Line';
import PassingTime from 'model/PassingTime';
import ServiceJourney from 'model/ServiceJourney';
import StopPoint from 'model/StopPoint';
import moment from 'moment';
import { IntlShape } from 'react-intl';

export const validLine = (line: Line, intl: IntlShape): boolean =>
  aboutLineStepIsValid(line) &&
  line.journeyPatterns!.every(
    (jp) =>
      validJourneyPattern(jp) && validServiceJourneys(jp.serviceJourneys, intl),
  );

export const getMaxAllowedStepIndex = (line: Line, intl: IntlShape) => {
  if (!aboutLineStepIsValid(line)) return 0;
  else if (line.journeyPatterns!.some((jp) => !validJourneyPattern(jp)))
    return 1;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validServiceJourneys(jp.serviceJourneys, intl),
    )
  )
    return 2;
  else return 3;
};

export const getMaxAllowedFlexibleLineStepIndex = (
  line: FlexibleLine,
  intl: IntlShape,
) => {
  if (!aboutFlexibleLineStepIsValid(line)) return 0;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validFlexibleLineJourneyPattern(jp, line.flexibleLineType),
    )
  )
    return 1;
  else if (
    line.journeyPatterns!.some(
      (jp) => !validServiceJourneys(jp.serviceJourneys, intl),
    )
  )
    return 2;
  else return 3;
};

export const currentStepIsValid = (
  currentStep: number,
  line: Line,
  intl: IntlShape,
) => {
  if (currentStep === 0) return aboutLineStepIsValid(line);
  else if (currentStep === 1)
    return line.journeyPatterns!.every((jp) => validJourneyPattern(jp));
  else if (currentStep === 2)
    return line.journeyPatterns!.every((jp) =>
      validServiceJourneys(jp.serviceJourneys, intl),
    );
  else if (currentStep === 3) return true;
  else return false;
};

export const currentFlexibleLineStepIsValid = (
  currentStep: number,
  line: FlexibleLine,
  intl: IntlShape,
) => {
  if (currentStep === 0) return aboutFlexibleLineStepIsValid(line);
  else if (currentStep === 1)
    return line.journeyPatterns!.every((jp) =>
      validFlexibleLineJourneyPattern(jp, line.flexibleLineType),
    );
  else if (currentStep === 2)
    return line.journeyPatterns!.every((jp) =>
      validServiceJourneys(jp.serviceJourneys, intl),
    );
  else if (currentStep === 3) return true;
  else return false;
};

export const aboutLineStepIsValid = (line: Line): boolean =>
  !isBlank(line.name) &&
  !isBlank(line.publicCode) &&
  !isBlank(line.operatorRef) &&
  !isBlank(line.networkRef) &&
  !isBlank(line.transportMode) &&
  !isBlank(line.transportSubmode);

export const validFlexibleLine = (
  line: FlexibleLine,
  intl: IntlShape,
): boolean =>
  aboutFlexibleLineStepIsValid(line) &&
  line.journeyPatterns!.every(
    (jp) =>
      validFlexibleLineJourneyPattern(jp, line.flexibleLineType) &&
      validServiceJourneys(jp.serviceJourneys, intl),
  );

export const aboutFlexibleLineStepIsValid = (line: FlexibleLine): boolean =>
  aboutLineStepIsValid(line) && !isBlank(line.flexibleLineType);

export const validJourneyPattern = (
  journeyPatterns?: JourneyPattern,
): boolean =>
  !!journeyPatterns &&
  !isBlank(journeyPatterns.name) &&
  validateStopPoints(journeyPatterns.pointsInSequence ?? []);

export const validFlexibleLineJourneyPattern = (
  journeyPatterns?: JourneyPattern,
  flexibleLineType?: FlexibleLineType,
): boolean => {
  if (flexibleLineType === FlexibleLineType.FLEXIBLE_AREAS_ONLY) {
    return (
      !!journeyPatterns &&
      !isBlank(journeyPatterns.name) &&
      validateFlexibleAreasOnlyStopPoints(
        journeyPatterns.pointsInSequence ?? [],
      )
    );
  } else {
    return validJourneyPattern(journeyPatterns);
  }
};

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

export const validServiceJourneys = (
  sjs: ServiceJourney[] | undefined,
  intl: IntlShape,
): boolean => sjs?.every((sj) => validateServiceJourney(sj, intl)) ?? false;

export const validateServiceJourney = (
  sj: ServiceJourney,
  intl: IntlShape,
): boolean => {
  const isBlankName = isBlank(sj.name);
  const validDayTimes = (sj.dayTypes?.[0]?.daysOfWeek?.length ?? 0) > 0;
  const { isValid } = validateTimes(sj.passingTimes ?? [], intl);
  const validDayTypes = validateDayTypes(sj.dayTypes);
  return !isBlankName && isValid && validDayTimes && validDayTypes;
};

export const isBefore = (
  passingTime: string | undefined,
  dayOffset: number | undefined,
  nextPassingTime: string | undefined,
  nextDayOffset: number | undefined,
) => {
  if (!passingTime || !nextPassingTime) return false;
  const date = moment(passingTime, 'HH:mm:ss').add(dayOffset ?? 0, 'days');
  const nextDate = moment(nextPassingTime, 'HH:mm:ss').add(
    nextDayOffset ?? 0,
    'days',
  );

  return date < nextDate;
};

export const isAfter = (
  passingTime: string | undefined,
  dayOffset: number | undefined,
  nextPassingTime: string | undefined,
  nextDayOffset: number | undefined,
) => {
  if (!passingTime || !nextPassingTime) return false;
  const date = moment(passingTime, 'HH:mm:ss').add(dayOffset ?? 0, 'days');
  const nextDate = moment(nextPassingTime, 'HH:mm:ss').add(
    nextDayOffset ?? 0,
    'days',
  );

  return date > nextDate;
};

const hasAtleastOneFieldSet = (passingTime: PassingTime) => {
  const {
    departureTime,
    earliestDepartureTime,
    arrivalTime,
    latestArrivalTime,
  } = passingTime;
  return Boolean(
    departureTime || earliestDepartureTime || arrivalTime || latestArrivalTime,
  );
};

export const validateTimes = (
  passingTimes: PassingTime[],
  intl: IntlShape,
): { isValid: boolean; errorMessage: string } => {
  const getMessage = (message: keyof MessagesKey) =>
    intl ? intl.formatMessage({ id: message }) : '';

  if (passingTimes.length < 2)
    return {
      isValid: false,
      errorMessage: getMessage('errorStopPoints'),
    };

  const firstError = passingTimes
    .map((passingTime, index: number) => {
      const {
        departureTime,
        arrivalTime,
        latestArrivalTime,
        earliestDepartureTime,
        departureDayOffset,
        arrivalDayOffset,
        latestArrivalDayOffset,
        earliestDepartureDayOffset,
      } = passingTime;

      if (!hasAtleastOneFieldSet(passingTime))
        return {
          isValid: false,
          errorMessage: getMessage('errorAllPassingTimesMustBeFilled'),
        };

      if (
        isBefore(
          departureTime!,
          departureDayOffset!,
          arrivalTime!,
          arrivalDayOffset!,
        ) ||
        isBefore(
          latestArrivalTime!,
          latestArrivalDayOffset!,
          earliestDepartureTime!,
          earliestDepartureDayOffset!,
        )
      )
        return {
          isValid: false,
          errorMessage: getMessage('errorDepartureAfterArrival'),
        };
      if (
        isBefore(
          departureTime!,
          departureDayOffset!,
          earliestDepartureTime!,
          earliestDepartureDayOffset!,
        )
      )
        return {
          isValid: false,
          errorMessage: getMessage('errorDepartureAfterEarliest'),
        };
      if (
        isBefore(
          latestArrivalTime!,
          latestArrivalDayOffset!,
          arrivalTime!,
          arrivalDayOffset!,
        )
      )
        return {
          isValid: false,
          errorMessage: getMessage('errorArrivalBeforeLatest'),
        };
      if (index === 0) return { isValid: true, errorMessage: '' };
      if (
        index === passingTimes.length - 1 &&
        !passingTime.arrivalTime &&
        !passingTime.latestArrivalTime
      ) {
        return {
          isValid: false,
          errorMessage: getMessage('errorLastArrivalMustBeSet'),
        };
      }

      const prevPassingTime = passingTimes[index - 1];

      if (
        isBefore(
          departureTime!,
          departureDayOffset!,
          prevPassingTime.departureTime!,
          prevPassingTime.departureDayOffset!,
        ) ||
        isBefore(
          departureTime!,
          departureDayOffset!,
          prevPassingTime.arrivalTime!,
          prevPassingTime.arrivalDayOffset!,
        ) ||
        isBefore(
          arrivalTime!,
          arrivalDayOffset!,
          prevPassingTime.arrivalTime!,
          prevPassingTime.arrivalDayOffset!,
        ) ||
        isBefore(
          arrivalTime!,
          arrivalDayOffset!,
          prevPassingTime.departureTime!,
          prevPassingTime.departureDayOffset!,
        ) ||
        isBefore(
          latestArrivalTime!,
          latestArrivalDayOffset!,
          prevPassingTime.latestArrivalTime!,
          prevPassingTime.latestArrivalDayOffset!,
        ) ||
        isBefore(
          earliestDepartureTime!,
          earliestDepartureDayOffset!,
          prevPassingTime.earliestDepartureTime!,
          prevPassingTime.earliestDepartureDayOffset!,
        ) ||
        isBefore(
          earliestDepartureTime!,
          earliestDepartureDayOffset!,
          prevPassingTime.departureTime!,
          prevPassingTime.departureDayOffset!,
        ) ||
        isBefore(
          earliestDepartureTime!,
          earliestDepartureDayOffset!,
          prevPassingTime.arrivalTime!,
          prevPassingTime.arrivalDayOffset!,
        ) ||
        isBefore(
          arrivalTime!,
          arrivalDayOffset!,
          prevPassingTime.earliestDepartureTime!,
          prevPassingTime.earliestDepartureDayOffset!,
        ) ||
        isBefore(
          arrivalTime!,
          arrivalDayOffset!,
          prevPassingTime.latestArrivalTime!,
          prevPassingTime.latestArrivalDayOffset!,
        )
      ) {
        return {
          isValid: false,
          errorMessage: getMessage('errorLaterThanPrevious'),
        };
      }
      return {
        isValid: true,
        errorMessage: '',
      };
    })
    .find((e) => !e.isValid);

  return firstError || { isValid: true, errorMessage: '' };
};

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const validateDayType = (dayType: DayType) => {
  const daysOfWeek =
    dayType.daysOfWeek?.map((dow) => WEEKDAYS.indexOf(dow)) || [];

  return dayType.dayTypeAssignments.every((dta) => {
    let from = parseISO(dta.operatingPeriod.fromDate);
    const to = parseISO(dta.operatingPeriod.toDate);

    while (isDateEqual(to, from) || isDateAfter(to, from)) {
      if (daysOfWeek.includes(getDay(from))) {
        return true;
      }
      from = addDays(from, 1);
    }

    return false;
  });
};

export const validateDayTypes = (dayTypes?: DayType[]) => {
  return (dayTypes && dayTypes.every(validateDayType)) || false;
};

export const validateBookingArrangement = (
  bookingArrangement?: BookingArrangement,
) => {
  if (
    bookingArrangement?.minimumBookingPeriod &&
    bookingArrangement?.bookWhen
  ) {
    return false;
  }

  if (!bookingArrangement?.bookWhen && bookingArrangement?.latestBookingTime) {
    return false;
  }

  if (bookingArrangement?.bookWhen && !bookingArrangement?.latestBookingTime) {
    return false;
  }

  if (
    !bookingArrangement?.minimumBookingPeriod &&
    !bookingArrangement?.latestBookingTime &&
    !bookingArrangement?.bookWhen
  ) {
    return false;
  }

  return true;
};
