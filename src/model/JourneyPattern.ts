import StopPoint, { stopPointToPayload } from './StopPoint';
import ServiceJourney, { serviceJourneyToPayload } from './ServiceJourney';
import Notice from './Notice';
import { DIRECTION_TYPE } from 'model/enums';
import VersionedType from 'model/VersionedType';

export type JourneyPattern = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  directionType?: DIRECTION_TYPE;
  pointsInSequence: StopPoint[];
  serviceJourneys: ServiceJourney[];
  notices?: Notice[];
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
  serviceJourneys: journeyPattern.serviceJourneys.map((sj) =>
    serviceJourneyToPayload(sj)
  ),
  pointsInSequence: journeyPattern.pointsInSequence.map((pis) =>
    stopPointToPayload(pis)
  ),
});

export default JourneyPattern;
