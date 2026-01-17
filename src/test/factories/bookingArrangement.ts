import BookingArrangement from 'model/BookingArrangement';
import Contact from 'model/Contact';
import { BOOKING_ACCESS, BOOKING_METHOD, PURCHASE_WHEN } from 'model/enums';
import { DeepPartial } from './types';
import { deepMerge } from './utils';

/**
 * Create a Contact with sensible defaults
 */
export const createContact = (overrides?: DeepPartial<Contact>): Contact => {
  const defaults: Contact = {
    contactPerson: 'Test Contact',
    phone: '+47 123 45 678',
    email: 'test@example.com',
    url: 'https://example.com/booking',
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create an empty Contact (for testing empty state)
 */
export const createEmptyContact = (): Contact => ({});

/**
 * Create a BookingArrangement with sensible defaults
 */
export const createBookingArrangement = (
  overrides?: DeepPartial<BookingArrangement>,
): BookingArrangement => {
  const defaults: BookingArrangement = {
    bookingContact: createContact(),
    bookingMethods: [BOOKING_METHOD.CALL_OFFICE, BOOKING_METHOD.ONLINE],
    bookingAccess: BOOKING_ACCESS.PUBLIC,
    bookWhen: PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL,
    bookingNote: 'Book at least 1 hour in advance',
    latestBookingTime: '08:00:00',
    minimumBookingPeriod: 'PT1H',
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a minimal BookingArrangement (phone booking only)
 */
export const createMinimalBookingArrangement = (
  overrides?: DeepPartial<BookingArrangement>,
): BookingArrangement => {
  return createBookingArrangement({
    bookingMethods: [BOOKING_METHOD.CALL_OFFICE],
    bookingNote: undefined,
    latestBookingTime: undefined,
    minimumBookingPeriod: undefined,
    ...overrides,
  });
};

/**
 * Create an online-only BookingArrangement
 */
export const createOnlineBookingArrangement = (
  overrides?: DeepPartial<BookingArrangement>,
): BookingArrangement => {
  return createBookingArrangement({
    bookingMethods: [BOOKING_METHOD.ONLINE],
    bookingNote: 'Book online at example.com',
    ...overrides,
  });
};
