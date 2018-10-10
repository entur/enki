import Versioned from './base/Versioned';
import Network from './Network';
import BookingArrangement from './BookingArrangement';
import JourneyPattern from './JourneyPattern';
import Notice from './Notice';
import { FLEXIBLE_LINE_TYPE, VEHICLE_MODE, VEHICLE_SUBMODE } from './enums';

class FlexibleLine extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name || '';
    this.description = data.description || '';
    this.privateCode = data.privateCode || '';
    this.publicCode = data.publicCode || '';
    this.transportMode = data.transportMode || VEHICLE_MODE.BUS;
    this.transportSubMode = data.transportSubMode || VEHICLE_SUBMODE.LOCAL_BUS;
    this.flexibleLineType =
      data.flexibleLineType || FLEXIBLE_LINE_TYPE.FLEXIBLE_AREAS_ONLY;
    this.network = data.network ? new Network(data.network) : null;
    this.networkRef = data.networkRef || '';
    this.operatorRef = data.operatorRef || '';
    this.bookingArrangement = data.bookingArrangement
      ? new BookingArrangement(data.bookingArrangement)
      : null;
    this.journeyPatterns = (data.journeyPatterns || []).map(
      jp => new JourneyPattern(jp)
    );
    this.notices = (data.notices || []).map(n => new Notice(n));
  }
}

export default FlexibleLine;
