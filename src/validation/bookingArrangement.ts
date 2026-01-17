import BookingArrangement from 'model/BookingArrangement';

/**
 * Validates a booking arrangement.
 *
 * Rules:
 * 1. minimumBookingPeriod and bookWhen are mutually exclusive
 * 2. bookWhen and latestBookingTime must be set together
 * 3. At least one booking timing option must be set (minimumBookingPeriod OR bookWhen+latestBookingTime)
 */
export const validateBookingArrangement = (
  bookingArrangement?: BookingArrangement,
): boolean => {
  if (
    bookingArrangement?.minimumBookingPeriod &&
    bookingArrangement?.bookWhen
  ) {
    return false;
  }

  if (!bookingArrangement?.bookWhen && bookingArrangement?.latestBookingTime) {
    return false;
  }

  if (bookingArrangement?.bookWhen && !bookingArrangement?.latestBookingTime) {
    return false;
  }

  if (
    !bookingArrangement?.minimumBookingPeriod &&
    !bookingArrangement?.latestBookingTime &&
    !bookingArrangement?.bookWhen
  ) {
    return false;
  }

  return true;
};
