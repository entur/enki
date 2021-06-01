import StopPoint, { stopPointToPayload } from './StopPoint';
import ServiceJourney, { serviceJourneyToPayload } from './ServiceJourney';
import Notice from './Notice';
import { DIRECTION_TYPE } from 'model/enums';
import VersionedType from 'model/VersionedType';
import { createUuid } from 'helpers/generators';

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
  serviceJourneys: [{ id: `new_${createUuid()}`, passingTimes: [{}, {}] }],
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
