import Versioned from './base/Versioned';
import Network from './Network';
import BookingArrangement from './BookingArrangement';
import JourneyPattern from './JourneyPattern';
import Notice from './Notice';

class FlexibleLine extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.publicCode = data.publicCode;
    this.transportMode = data.transportMode;
    this.transportSubmode = data.transportSubmode;
    this.flexibleLineType = data.flexibleLineType;
    this.network = data.network ? new Network(data.network) : undefined;
    this.networkRef =
      data.networkRef || data.network ? data.network.id : undefined;
    this.operatorRef = data.operatorRef;
    this.bookingArrangement = data.bookingArrangement
      ? new BookingArrangement(data.bookingArrangement)
      : undefined;
    this.journeyPatterns = (data.journeyPatterns || []).map(
      jp => new JourneyPattern(jp)
    );
    this.notices = (data.notices || []).map(n => new Notice(n));
  }

  toPayload() {
    let payload = this.withChanges({
      journeyPatterns: this.journeyPatterns.map(jp => jp.toPayload())
    });
    delete payload.network;
    return payload;
  }
}

export default FlexibleLine;
