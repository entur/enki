import Versioned from './base/Versioned';
import Notice from './Notice';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  arrivalTime?: string;
  arrivalDayOffset?: number;
  departureTime?: string;
  departureDayOffset?: number;
  latestArrivalTime?: string;
  latestArrivalDayOffset?: number;
  earliestDepartureTime?: string;
  earliestDepartureDayOffset?: number;
  notices?: Notice[];
};

class PassingTime extends Versioned {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  arrivalTime: string | undefined;
  arrivalDayOffset: number | undefined;
  departureTime: string | undefined;
  departureDayOffset: number | undefined;
  latestArrivalTime: string | undefined;
  latestArrivalDayOffset: number | undefined;
  earliestDepartureTime: string | undefined;
  earliestDepartureDayOffset: number | undefined;
  notices: Notice[];

  constructor(data: Data = {}) {
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
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }
}

export default PassingTime;
