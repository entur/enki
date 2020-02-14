import moment from 'moment';
import messages from './messages';
import { getIntl } from '../../../../../../../../../i18n';
import { errorMonitor } from 'events';

const isBefore = (
  passingTime: string | undefined,
  dayOffset: number,
  nextPassingTime: string | undefined,
  nextDayOffset: number
) => {
  if (!passingTime || !nextPassingTime) return false;
  const date = moment(passingTime, 'HH:mm:ss').add(dayOffset, 'days');
  const nextDate = moment(nextPassingTime, 'HH:mm:ss').add(
    nextDayOffset,
    'days'
  );

  return date < nextDate;
};

const hasAtleastOneFieldSet = (passingTime: any) => {
  const {
    departure,
    earliestDepartureTime,
    arrivalTime,
    latestArrivalTime
  } = passingTime;
  return Boolean(
    departure || earliestDepartureTime || arrivalTime || latestArrivalTime
  );
};

export const validateTimes = (
  passingTimes: any[],
  intlState: any
): { isValid: boolean; errorMessage: string } => {
  if (!(passingTimes?.length >= 2))
    return {
      isValid: false,
      errorMessage: 'Requires at least two stop points.'
    };
  const intl = getIntl(intlState);

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
        earliestDepartureDayOffset
      } = passingTime;

      if (!hasAtleastOneFieldSet(passingTime))
        return {
          isValid: false,
          errorMessage: intl.formatMessage(messages.atleastOneField)
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
          errorMessage: intl.formatMessage(messages.departureAfterArrival)
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
          errorMessage: intl.formatMessage(messages.departureAfterEarliest)
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
          errorMessage: intl.formatMessage(messages.arrivalBeforeLatest)
        };
      if (index === 0) return { isValid: true, errorMessage: '' };
      if (
        index === passingTimes.length - 1 &&
        !passingTime.arrivalTime && !passingTime.latestArrivalTime
      ) {
        return {
          isValid: false,
          errorMessage: intl.formatMessage(messages.lastArrivalMustBeSet)
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
          errorMessage: intl.formatMessage(messages.laterThanPrevious)
        };
      }
      return {
        isValid: true,
        errorMessage: ''
      };
    })
    .find(e => !e.isValid);

  return firstError || { isValid: true, errorMessage: '' };
};
