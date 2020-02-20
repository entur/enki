import Versioned from './base/Versioned';
import DayType from './DayType';
import PassingTime from './PassingTime';
import BookingArrangement from './BookingArrangement';

class ServiceJourney extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.publicCode = data.publicCode;
    this.operatorRef = data.operatorRef;
    this.bookingArrangement = data.bookingArrangement
      ? new BookingArrangement(data.bookingArrangement)
      : null;
    this.passingTimes = (data.passingTimes || []).map(
      pt => new PassingTime(pt)
    );
    this.dayTypes = (data.dayTypes || []).map(dt => new DayType(dt));
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }
}

export default ServiceJourney;
