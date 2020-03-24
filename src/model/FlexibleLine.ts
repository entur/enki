import BookingArrangement from './BookingArrangement';
import JourneyPattern, { journeyPatternToPayload } from './JourneyPattern';
import Notice from './Notice';
import { Network } from './Network';
import VersionedType from 'model/VersionedType';

type FlexibleLine = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  publicCode?: string;
  transportMode?: string;
  transportSubmode?: string;
  flexibleLineType?: string;
  network?: Network;
  networkRef?: string; // Either of network or networkRef seems useless / duplicated
  operatorRef?: string;
  bookingArrangement?: BookingArrangement;
  journeyPatterns?: JourneyPattern[];
  notices?: Notice[];
};

export const flexibleLineToPayload = (flexibleLine: FlexibleLine) => {
  const { network, ...rest } = flexibleLine;
  return {
    ...rest,
    journeyPatterns: flexibleLine.journeyPatterns?.map(journeyPattern =>
      journeyPatternToPayload(journeyPattern)
    )
  };
};

export default FlexibleLine;
