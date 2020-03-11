import Versioned from './base/Versioned';
import DayType from './DayType';
import PassingTime from './PassingTime';
import BookingArrangement from './BookingArrangement';
import Notice from './Notice';

type Data = {
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

class ServiceJourney extends Versioned {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  publicCode: string | undefined;
  operatorRef: string | undefined;
  bookingArrangement: BookingArrangement | undefined;
  passingTimes: PassingTime[];
  dayTypes: DayType[];
  notices: Notice[];

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.publicCode = data.publicCode;
    this.operatorRef = data.operatorRef;
    this.bookingArrangement = data.bookingArrangement;
    this.passingTimes = (data.passingTimes || []).map(
      pt => new PassingTime(pt)
    );
    this.dayTypes = data.dayTypes || [];
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }
}

export default ServiceJourney;
