import Contact from './Contact';
import {
  BOOKING_METHOD,
  PURCHASE_MOMENT,
  BOOKING_ACCESS,
  PURCHASE_WHEN,
} from 'model/enums';

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

export const bookingArrangementIsEmpty = (
  bookingArrangement: BookingArrangement
): boolean =>
  !bookingArrangement.name &&
  !bookingArrangement.description &&
  !bookingArrangement.privateCode &&
  !bookingArrangement.bookingContact &&
  !bookingArrangement.bookingNote &&
  (bookingArrangement.bookingMethods ?? []).length === 0 &&
  !bookingArrangement.bookingAccess &&
  !bookingArrangement.bookWhen &&
  bookingArrangement.buyWhen?.length === 0 &&
  !bookingArrangement.latestBookingTime &&
  !bookingArrangement.minimumBookingPeriod;

export default BookingArrangement;
