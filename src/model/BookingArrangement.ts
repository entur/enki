import Contact from './Contact';
import { BOOKING_METHOD, PURCHASE_MOMENT } from 'model/enums';

type BookingArrangement = {
  name?: string;
  description?: string;
  privateCode?: string;
  bookingContact?: Contact;
  bookingNote?: string;
  bookingMethods?: BOOKING_METHOD[];
  bookingAccess?: any;
  bookWhen?: any;
  buyWhen?: PURCHASE_MOMENT[];
  latestBookingTime?: any;
  minimumBookingPeriod?: any;
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
