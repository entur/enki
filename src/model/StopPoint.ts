import VersionedType from 'model/VersionedType';
import BookingArrangement from './BookingArrangement';
import FlexibleStopPlace from './FlexibleStopPlace';
import Notice from './Notice';

type DestinationDisplay = {
  frontText?: string;
};

type StopPoint = VersionedType & {
  flexibleStopPlace?: FlexibleStopPlace;
  flexibleStopPlaceRef?: string | null;
  quayRef?: string | null;
  bookingArrangement?: BookingArrangement | null;
  destinationDisplay?: DestinationDisplay | null;
  forBoarding?: boolean | null;
  forAlighting?: boolean | null;
  notices?: Notice[];
};

export const stopPointToPayload = (stopPoint: StopPoint) => {
  const { flexibleStopPlace, ...rest } = stopPoint;
  return rest;
};

export default StopPoint;
