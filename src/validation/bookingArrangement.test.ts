import { describe, it, expect } from 'vitest';
import { createBookingArrangement } from 'test/factories';
import BookingArrangement from 'model/BookingArrangement';
import { validateBookingArrangement } from './bookingArrangement';

describe('validateBookingArrangement', () => {
  describe('mutual exclusivity: minimumBookingPeriod vs bookWhen', () => {
    it('returns false when both minimumBookingPeriod and bookWhen are set', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT1H',
        bookWhen: 'advanceAndDayOfTravel' as any,
        latestBookingTime: '08:00:00',
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(false);
    });

    it('returns true when only minimumBookingPeriod is set', () => {
      // Note: Using null to clear fields since deepMerge skips undefined
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT1H',
        bookWhen: null as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });

    it('returns true when only bookWhen and latestBookingTime are set', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: null as any,
        bookWhen: 'advanceAndDayOfTravel' as any,
        latestBookingTime: '08:00:00',
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });
  });

  describe('required pairs: bookWhen and latestBookingTime', () => {
    it('returns false when bookWhen is set but latestBookingTime is not', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: null as any,
        bookWhen: 'advanceAndDayOfTravel' as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(false);
    });

    it('returns false when latestBookingTime is set but bookWhen is not', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: null as any,
        bookWhen: null as any,
        latestBookingTime: '08:00:00',
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(false);
    });

    it('returns true when both bookWhen and latestBookingTime are set together', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: null as any,
        bookWhen: 'dayOfTravelOnly' as any,
        latestBookingTime: '10:00:00',
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });
  });

  describe('at least one booking option required', () => {
    it('returns false when no booking timing option is set', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: null as any,
        bookWhen: null as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(false);
    });

    it('returns true with minimumBookingPeriod alone', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT30M',
        bookWhen: null as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });

    it('returns true with bookWhen and latestBookingTime together', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: null as any,
        bookWhen: 'untilPreviousDay' as any,
        latestBookingTime: '18:00:00',
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });
  });

  describe('undefined/null input handling', () => {
    it('returns false when bookingArrangement is undefined', () => {
      expect(validateBookingArrangement(undefined)).toBe(false);
    });

    it('returns false when bookingArrangement is an empty object', () => {
      expect(validateBookingArrangement({})).toBe(false);
    });
  });

  describe('various minimumBookingPeriod formats', () => {
    it('returns true for ISO 8601 duration format PT10M (10 minutes)', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT10M',
        bookWhen: null as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });

    it('returns true for ISO 8601 duration format PT2H (2 hours)', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT2H',
        bookWhen: null as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });

    it('returns true for ISO 8601 duration format P1D (1 day)', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'P1D',
        bookWhen: null as any,
        latestBookingTime: null as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });
  });

  describe('integration with other BookingArrangement fields', () => {
    it('validates regardless of other optional fields being set', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT1H',
        bookWhen: null as any,
        latestBookingTime: null as any,
        bookingNote: 'Please book in advance',
        bookingAccess: 'public' as any,
        bookingMethods: ['callOffice'] as any,
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });

    it('validates with contact information set', () => {
      const bookingArrangement = createBookingArrangement({
        minimumBookingPeriod: 'PT1H',
        bookWhen: null as any,
        latestBookingTime: null as any,
        bookingContact: {
          contactPerson: 'John Doe',
          phone: '+47 123 45 678',
          email: 'booking@example.com',
        },
      });
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });

    it('validates a minimal booking arrangement with only required fields', () => {
      // Create a minimal valid arrangement: only minimumBookingPeriod is needed
      // (without bookWhen/latestBookingTime pair)
      const bookingArrangement: BookingArrangement = {
        minimumBookingPeriod: 'PT30M',
      };
      expect(validateBookingArrangement(bookingArrangement)).toBe(true);
    });
  });
});
