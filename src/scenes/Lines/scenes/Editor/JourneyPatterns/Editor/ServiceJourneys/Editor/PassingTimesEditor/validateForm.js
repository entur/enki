import moment from 'moment';

const isBefore = (passingTime, dayOffset, nextPassingTime, nextDayOffset) => {
  if (!passingTime || !nextPassingTime) return false;
  const date = moment(passingTime, 'HH:mm:ss').add(dayOffset, 'days');
  const nextDate = moment(nextPassingTime, 'HH:mm:ss').add(
    nextDayOffset,
    'days'
  );

  return date < nextDate;
};

const hasAtleastOneFieldSet = passingTime => {
  const {
    departure,
    earliestDepartureTime,
    arrivalTime,
    latestArrivalTime
  } = passingTime;
  return Boolean(
    departure || earliestDepartureTime || arrivalTime,
    latestArrivalTime
  );
};

export const validateTimes = passingTimes => {
  if (!passingTimes?.length) return false;

  return passingTimes.every((passingTime, index) => {
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

    if (!hasAtleastOneFieldSet(passingTime)) return false;
    if (
      isBefore(arrivalTime, arrivalDayOffset, departureTime, departureDayOffset)
    )
      return false;
    if (
      isBefore(
        departureTime,
        departureDayOffset,
        earliestDepartureTime,
        earliestDepartureDayOffset
      )
    )
      return false;
    if (
      isBefore(
        latestArrivalTime,
        latestArrivalDayOffset,
        arrivalTime,
        arrivalDayOffset
      )
    )
      return false;
    if (index === 0) return true;

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
      return false;
    }
    return true;
  });
};
