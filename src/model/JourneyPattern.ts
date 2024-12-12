import { createUuid } from 'helpers/generators';
import VersionedType from 'model/VersionedType';
import { DIRECTION_TYPE } from 'model/enums';
import Notice from './Notice';
import ServiceJourney, { serviceJourneyToPayload } from './ServiceJourney';
import StopPoint, {
  flexibleStopPointToPayload,
  stopPointToPayload,
} from './StopPoint';

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
  serviceJourneys: [{ id: `new_${createUuid()}`, passingTimes: [] }],
  pointsInSequence: [],
});

export const journeyPatternToPayload = (
  journeyPattern: JourneyPattern,
  isFlexible = false,
) => ({
  ...journeyPattern,
  serviceJourneys: journeyPattern.serviceJourneys.map((sj) =>
    serviceJourneyToPayload(sj),
  ),
  pointsInSequence: journeyPattern.pointsInSequence.map((pis) =>
    isFlexible ? flexibleStopPointToPayload(pis) : stopPointToPayload(pis),
  ),
  notices: journeyPattern.notices?.filter(
    (notice) => notice && notice.text && notice.text !== '',
  ),
});

export default JourneyPattern;
