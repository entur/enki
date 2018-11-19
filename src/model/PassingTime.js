import Versioned from './base/Versioned';
import Notice from './Notice';

class PassingTime extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.arrivalTime = data.arrivalTime;
    this.arrivalDayOffset = data.arrivalDayOffset;
    this.departureTime = data.departureTime;
    this.departureDayOffset = data.departureDayOffset;
    this.latestArrivalTime = data.latestArrivalTime;
    this.latestArrivalDayOffset = data.latestArrivalDayOffset;
    this.earliestDepartureTime = data.earliestDepartureTime;
    this.earliestDepartureDayOffset = data.earliestDepartureDayOffset;
    this.notices = (data.notices || []).map(n => new Notice(n));
  }
}

export default PassingTime;
