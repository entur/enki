import DayType from './DayType';
import PassingTime from './PassingTime';
import BookingArrangement from './BookingArrangement';
import Notice from './Notice';
import VersionedType from 'model/base/VersionedType';

type ServiceJourney = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  publicCode?: string;
  operatorRef?: string;
  bookingArrangement?: BookingArrangement;
  passingTimes?: PassingTime[];
  dayTypes?: DayType[];
  notices?: Notice[];
};

export default ServiceJourney;
