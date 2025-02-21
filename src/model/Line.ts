import VersionedType from 'model/VersionedType';
import { VEHICLE_MODE, VEHICLE_SUBMODE } from 'model/enums';
import JourneyPattern, {
  initJourneyPatterns,
  journeyPatternToPayload,
} from './JourneyPattern';
import { Network } from './Network';
import Notice from './Notice';
import { Branding } from './Branding';

interface Line extends VersionedType {
  name?: string;
  description?: string | null;
  privateCode?: string | null;
  publicCode?: string;
  transportMode?: VEHICLE_MODE;
  transportSubmode?: VEHICLE_SUBMODE;
  network?: Network;
  networkRef?: string;
  operatorRef?: string;
  branding?: Branding;
  brandingRef?: string;
  journeyPatterns?: JourneyPattern[];
  notices?: Notice[];
}

export const initLine = () => ({
  journeyPatterns: initJourneyPatterns(),
});

export const lineToPayload = (line: Line, isFlexible = false) => {
  const { network, branding, ...rest } = line;
  return {
    ...rest,
    brandingRef: rest.brandingRef || null,
    journeyPatterns: line.journeyPatterns?.map((journeyPattern) =>
      journeyPatternToPayload(journeyPattern, isFlexible),
    ),
    notices: line.notices?.filter(
      (notice) => notice && notice.text && notice.text !== '',
    ),
  };
};

export default Line;
