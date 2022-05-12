import DayType from './DayType';
import PassingTime from './PassingTime';
import BookingArrangement from './BookingArrangement';
import Notice from './Notice';
import VersionedType from 'model/VersionedType';

type ServiceJourney = VersionedType & {
  name?: string;
  description?: string | null;
  privateCode?: string | null;
  publicCode?: string | null;
  operatorRef?: string | null;
  bookingArrangement?: BookingArrangement | null;
  passingTimes: PassingTime[];
  dayTypes?: DayType[];
  dayTypesRefs?: string[];
  notices?: Notice[];
};

export const serviceJourneyToPayload = (sj: ServiceJourney) => {
  if (sj.id?.startsWith('new_')) {
    delete sj.id;
  }

  return {
    ...sj,
    dayTypes: undefined,
    dayTypesRefs: sj.dayTypes?.map((dt) => dt.id!),
  };
};

export default ServiceJourney;
