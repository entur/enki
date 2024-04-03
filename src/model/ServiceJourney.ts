import VersionedType from 'model/VersionedType';
import BookingArrangement from './BookingArrangement';
import DayType from './DayType';
import Notice from './Notice';
import PassingTime, { passingTimeToPayload } from './PassingTime';

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
    passingTimes: sj.passingTimes.map((pt, i) =>
      passingTimeToPayload(pt, i, sj.passingTimes.length),
    ),
    dayTypes: undefined,
    dayTypesRefs: sj.dayTypes?.map((dt) => dt.id!),
    notices: sj.notices?.filter(
      (notice) => notice && notice.text && notice.text !== '',
    ),
  };
};

export default ServiceJourney;
