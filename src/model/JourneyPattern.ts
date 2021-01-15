import StopPoint, { stopPointToPayload } from './StopPoint';
import ServiceJourney from './ServiceJourney';
import Notice from './Notice';
import { DIRECTION_TYPE } from 'model/enums';
import VersionedType from 'model/VersionedType';

export type JourneyPattern = VersionedType & {
  name?: string;
  description?: string | null;
  privateCode?: string | null;
  directionType?: DIRECTION_TYPE | null;
  pointsInSequence: StopPoint[];
  serviceJourneys: ServiceJourney[];
  notices?: Notice[] | null;
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
