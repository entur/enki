import moment from 'moment';
import messages from './messages';
import { getIntl } from 'i18n';
import PassingTime from 'model/PassingTime';
import { IntlState } from 'react-intl-redux';

const isBefore = (
  passingTime: string | undefined,
  dayOffset: number | undefined,
  nextPassingTime: string | undefined,
  nextDayOffset: number | undefined
) => {
  if (!passingTime || !nextPassingTime) return false;
  const date = moment(passingTime, 'HH:mm:ss').add(dayOffset ?? 0, 'days');
  const nextDate = moment(nextPassingTime, 'HH:mm:ss').add(
    nextDayOffset ?? 0,
    'days'
  );

  return date < nextDate;
};

const hasAtleastOneFieldSet = (passingTime: PassingTime) => {
  const {
    departureTime,
    earliestDepartureTime,
    arrivalTime,
    latestArrivalTime,
  } = passingTime;
  return Boolean(
    departureTime || earliestDepartureTime || arrivalTime || latestArrivalTime
  );
};

export const validateTimes = (
  passingTimes: PassingTime[],
  intlState?: IntlState
): { isValid: boolean; errorMessage: string } => {
  const intl = intlState && getIntl({ intl: intlState });
  const getMessage = (message: any) =>
    intlState ? intl.formatMessage(message) : '';

  if (passingTimes.length < 2)
    return {
      isValid: false,
      errorMessage: getMessage(messages.stopPointsInfo),
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
          errorMessage: getMessage(messages.atleastOneField),
        };
      if (
        isBefore(
          departureTime,
          departureDayOffset,
          arrivalTime,
          arrivalDayOffset
        )
      )
        return {
          isValid: false,
          errorMessage: getMessage(messages.departureAfterArrival),
        };
      if (
        isBefore(
          departureTime,
          departureDayOffset,
          earliestDepartureTime,
          earliestDepartureDayOffset
        )
      )
        return {
          isValid: false,
          errorMessage: getMessage(messages.departureAfterEarliest),
        };
      if (
        isBefore(
          latestArrivalTime,
          latestArrivalDayOffset,
          arrivalTime,
          arrivalDayOffset
        )
      )
        return {
          isValid: false,
          errorMessage: getMessage(messages.arrivalBeforeLatest),
        };
      if (index === 0) return { isValid: true, errorMessage: '' };
      if (
        index === passingTimes.length - 1 &&
        !passingTime.arrivalTime &&
        !passingTime.latestArrivalTime
      ) {
        return {
          isValid: false,
          errorMessage: getMessage(messages.lastArrivalMustBeSet),
        };
      }

      const prevPassingTime = passingTimes[index - 1];

      if (
        isBefore(
          departureTime,
          departureDayOffset,
          prevPassingTime.departureTime,
          prevPassingTime.departureDayOffset
        ) ||
        isBefore(
          arrivalTime,
          arrivalDayOffset,
          prevPassingTime.arrivalTime,
          prevPassingTime.arrivalDayOffset
        ) ||
        isBefore(
          latestArrivalTime,
          latestArrivalDayOffset,
          prevPassingTime.latestArrivalTime,
          prevPassingTime.latestArrivalDayOffset
        ) ||
        isBefore(
          earliestDepartureTime,
          earliestDepartureDayOffset,
          prevPassingTime.earliestDepartureTime,
          prevPassingTime.earliestDepartureDayOffset
        )
      ) {
        return {
          isValid: false,
          errorMessage: getMessage(messages.laterThanPrevious),
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
