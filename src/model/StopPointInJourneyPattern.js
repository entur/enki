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
      : null;
    this.flexibleStopPlaceRef = data.flexibleStopPlaceRef || '';
    this.quayRef = data.quayRef || '';
    this.bookingArrangement = data.bookingArrangement
      ? new BookingArrangement(data.bookingArrangement)
      : null;
    this.destinationDisplay = data.destinationDisplay
      ? new DestinationDisplay(data.destinationDisplay)
      : null;
    this.forBoarding = data.forBoarding || '';
    this.forAlighting = data.forAlighting || '';
    this.notices = (data.notices || []).map(n => new Notice(n));
  }
}

export default StopPointInJourneyPattern;
