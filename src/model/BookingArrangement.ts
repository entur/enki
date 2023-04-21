import {
  BOOKING_ACCESS,
  BOOKING_METHOD,
  PURCHASE_MOMENT,
  PURCHASE_WHEN,
} from 'model/enums';
import Contact from './Contact';

type BookingArrangement = {
  name?: string;
  description?: string;
  privateCode?: string;
  bookingContact?: Contact;
  bookingNote?: string;
  bookingMethods?: BOOKING_METHOD[];
  bookingAccess?: BOOKING_ACCESS;
  bookWhen?: PURCHASE_WHEN;
  buyWhen?: PURCHASE_MOMENT[];
  latestBookingTime?: string;
  minimumBookingPeriod?: string; // ISO8601 format e.g PT10M for 10 minutes
};

export default BookingArrangement;
