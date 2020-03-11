import Versioned from './base/Versioned';
import FlexibleStopPlace from './FlexibleStopPlace';
import DestinationDisplay from './DestinationDisplay';
import BookingArrangement from './BookingArrangement';
import Notice from './Notice';

type Data = {
  flexibleStopPlace?: FlexibleStopPlace;
  flexibleStopPlaceRef?: string;
  quayRef?: string;
  bookingArrangement?: BookingArrangement;
  destinationDisplay?: DestinationDisplay;
  forBoarding?: boolean;
  forAlighting?: boolean;
  notices?: Notice[];
};

class StopPoint extends Versioned {
  flexibleStopPlace: FlexibleStopPlace | undefined;
  flexibleStopPlaceRef: string | undefined;
  quayRef: string | undefined;
  bookingArrangement: BookingArrangement | undefined;
  destinationDisplay: DestinationDisplay | undefined;
  forBoarding: boolean | undefined;
  forAlighting: boolean | undefined;
  notices: Notice[] | undefined;

  constructor(data: Data = {}) {
    super(data);

    this.flexibleStopPlace = data.flexibleStopPlace
      ? new FlexibleStopPlace(data.flexibleStopPlace)
      : undefined;
    this.flexibleStopPlaceRef =
      data.flexibleStopPlaceRef ||
      (data.flexibleStopPlace ? data.flexibleStopPlace.id : undefined);
    this.quayRef = data.quayRef;
    this.bookingArrangement = data.bookingArrangement;
    this.destinationDisplay = data.destinationDisplay
      ? new DestinationDisplay(data.destinationDisplay)
      : undefined;
    this.forBoarding = data.forBoarding;
    this.forAlighting = data.forAlighting;
    this.notices = (data.notices || []).map(n => ({ ...n }));
  }

  toPayload() {
    let payload = this.withChanges();
    delete payload.flexibleStopPlace;
    return payload;
  }
}

export default StopPoint;
