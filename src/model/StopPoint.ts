import VersionedType from 'model/VersionedType';
import BookingArrangement from './BookingArrangement';
import FlexibleStopPlace from './FlexibleStopPlace';
import Notice from './Notice';

type DestinationDisplay = {
  frontText?: string;
};

type StopPoint = VersionedType & {
  key: string;
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
  const { flexibleStopPlace, key, ...rest } = stopPoint;
  return rest;
};

export const flexibleStopPointToPayload = (stopPoint: StopPoint) => {
  const { flexibleStopPlace, key, ...rest } = stopPoint;
  // Since in MixedFlexibleStopPointsEditor there is a cleanup of extra fields going on, time to bring them back;
  // It's needed for the backend when updating a type of the stop point from "external" to "flexible" or vice versa
  if (!Object.keys(rest).includes('flexibleStopPlaceRef')) {
    rest['flexibleStopPlaceRef'] = null;
  }
  if (!Object.keys(rest).includes('quayRef')) {
    rest['quayRef'] = null;
  }
  return rest;
};

export default StopPoint;
