import StopPoint, { stopPointToPayload } from './StopPoint';
import ServiceJourney from './ServiceJourney';
import Notice from './Notice';
import { DIRECTION_TYPE } from 'model/enums';
import VersionedType from 'model/VersionedType';
import BookingArrangement from './BookingArrangement';

export type JourneyPattern = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  directionType?: DIRECTION_TYPE;
  pointsInSequence: StopPoint[];
  serviceJourneys: ServiceJourney[];
  notices?: Notice[];
  bookingArrangement?: BookingArrangement;
};

export const initJourneyPatterns = (): JourneyPattern[] => [
  initJourneyPattern(),
];

export const initJourneyPattern = (): JourneyPattern => ({
  serviceJourneys: [{ passingTimes: [{}, {}] }],
  pointsInSequence: [{}, {}],
});

export const journeyPatternToPayload = (journeyPattern: JourneyPattern) => ({
  ...journeyPattern,
  pointsInSequence: journeyPattern.pointsInSequence.map((pis) =>
    stopPointToPayload(pis)
  ),
});

export default JourneyPattern;
