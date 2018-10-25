import Versioned from './base/Versioned';
import FlexibleStopPlace from './FlexibleStopPlace';
import DestinationDisplay from './DestinationDisplay';
import BookingArrangement from './BookingArrangement';
import Notice from './Notice';

class StopPointInJourneyPattern extends Versioned {
  constructor(data = {}) {
    super(data);

    this.flexibleStopPlace = data.flexibleStopPlace
      ? new FlexibleStopPlace(data.flexibleStopPlace)
      : undefined;
    this.flexibleStopPlaceRef =
      data.flexibleStopPlaceRef ||
      (data.flexibleStopPlace ? data.flexibleStopPlace.id : undefined);
    this.quayRef = data.quayRef;
    this.bookingArrangement = data.bookingArrangement
      ? new BookingArrangement(data.bookingArrangement)
      : undefined;
    this.destinationDisplay = data.destinationDisplay
      ? new DestinationDisplay(data.destinationDisplay)
      : undefined;
    this.forBoarding = data.forBoarding;
    this.forAlighting = data.forAlighting;
    this.notices = (data.notices || []).map(n => new Notice(n));
  }

  toPayload() {
    let payload = this.withChanges();
    delete payload.flexibleStopPlace;
    return payload;
  }
}

export default StopPointInJourneyPattern;
