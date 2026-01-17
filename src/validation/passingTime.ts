import { MessagesKey } from 'i18n/translationKeys';
import PassingTime from 'model/PassingTime';
import { IntlShape } from 'react-intl';
import { isBefore } from './time';

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
