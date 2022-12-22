import JourneyPattern, {
  initJourneyPatterns,
  journeyPatternToPayload,
} from './JourneyPattern';
import Notice from './Notice';
import { Network } from './Network';
import VersionedType from 'model/VersionedType';
import { VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';

interface Line extends VersionedType {
  name?: string;
  description?: string | null;
  privateCode?: string | null;
  publicCode?: string;
  transportMode?: VEHICLE_MODE;
  transportSubmode?: VEHICLE_SUBMODE;
  network?: Network;
  networkRef?: string; // Either of network or networkRef seems useless / duplicated
  operatorRef?: string;
  journeyPatterns?: JourneyPattern[];
  notices?: Notice[];
}

export const initLine = () => ({
  journeyPatterns: initJourneyPatterns(),
});

export const lineToPayload = (line: Line) => {
  const { network, ...rest } = line;
  return {
    ...rest,
    journeyPatterns: line.journeyPatterns?.map((journeyPattern) =>
      journeyPatternToPayload(journeyPattern)
    ),
    notices: line.notices?.filter(
      (notice) => notice && notice.text && notice.text !== ''
    ),
  };
};

export default Line;
