import ServiceJourney from 'model/ServiceJourney';
import { isBefore } from './validation';

export const sortByDepartureTime = (
  serviceJourneys: ServiceJourney[]
): ServiceJourney[] => {
  return serviceJourneys
    .slice()
    .sort((a, b) =>
      isBefore(
        a.passingTimes[0].departureTime,
        a.passingTimes[0].departureDayOffset,
        b.passingTimes[0].departureTime,
        b.passingTimes[0].departureDayOffset
      )
        ? -1
        : 1
    );
};
