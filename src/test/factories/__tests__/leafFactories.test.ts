import { describe, it, expect, beforeEach } from 'vitest';
import { resetIdCounters } from '../utils';
import {
  createPassingTime,
  createFirstStopPassingTime,
  createLastStopPassingTime,
  createMiddleStopPassingTime,
  createPassingTimeSequence,
} from '../passingTime';
import {
  createContact,
  createEmptyContact,
  createBookingArrangement,
  createMinimalBookingArrangement,
  createOnlineBookingArrangement,
} from '../bookingArrangement';
import {
  createOperatingPeriod,
  createDayTypeAssignment,
  createUnavailableDayTypeAssignment,
  createDayType,
  createWeekendDayType,
  createSingleDayType,
  createExpiredDayType,
  createFutureDayType,
  createEmptyDayType,
} from '../dayType';
import {
  createPolygonGeoJSON,
  createFlexibleArea,
  createFlexibleStopPlace,
  createQuayStopPoint,
  createFlexibleStopPoint,
  createFirstStopPoint,
  createLastStopPoint,
  createStopPointSequence,
  createFlexibleStopPointSequence,
} from '../stopPoint';
import { BOOKING_METHOD, DAY_OF_WEEK } from 'model/enums';

describe('Leaf Entity Factories', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('PassingTime Factories', () => {
    describe('createPassingTime', () => {
      it('creates a passing time with default departure', () => {
        const pt = createPassingTime();

        expect(pt.id).toBe('TST:TimetabledPassingTime:1');
        expect(pt.departureTime).toBe('09:00:00');
        expect(pt.arrivalTime).toBeNull();
        expect(pt.departureDayOffset).toBe(0);
      });

      it('accepts overrides', () => {
        const pt = createPassingTime({
          departureTime: '10:30:00',
          departureDayOffset: 1,
        });

        expect(pt.departureTime).toBe('10:30:00');
        expect(pt.departureDayOffset).toBe(1);
      });
    });

    describe('createFirstStopPassingTime', () => {
      it('creates departure-only passing time', () => {
        const pt = createFirstStopPassingTime('08:00:00');

        expect(pt.departureTime).toBe('08:00:00');
        expect(pt.arrivalTime).toBeNull();
      });
    });

    describe('createLastStopPassingTime', () => {
      it('creates arrival-only passing time', () => {
        const pt = createLastStopPassingTime('18:00:00');

        expect(pt.arrivalTime).toBe('18:00:00');
        expect(pt.departureTime).toBeNull();
      });
    });

    describe('createMiddleStopPassingTime', () => {
      it('creates passing time with both arrival and departure', () => {
        const pt = createMiddleStopPassingTime('12:00:00', '12:05:00');

        expect(pt.arrivalTime).toBe('12:00:00');
        expect(pt.departureTime).toBe('12:05:00');
      });
    });

    describe('createPassingTimeSequence', () => {
      it('creates sequence with correct patterns for 3 stops', () => {
        const times = createPassingTimeSequence(3);

        expect(times).toHaveLength(3);

        // First stop: departure only
        expect(times[0].departureTime).toBe('09:00:00');
        expect(times[0].arrivalTime).toBeNull();

        // Middle stop: both arrival and departure
        expect(times[1].arrivalTime).toBe('09:15:00');
        expect(times[1].departureTime).toBe('09:15:00');

        // Last stop: arrival only
        expect(times[2].arrivalTime).toBe('09:30:00');
        expect(times[2].departureTime).toBeNull();
      });

      it('uses custom start hour and interval', () => {
        const times = createPassingTimeSequence(2, 14, 30);

        expect(times[0].departureTime).toBe('14:00:00');
        expect(times[1].arrivalTime).toBe('14:30:00');
      });

      it('handles single stop sequence', () => {
        const times = createPassingTimeSequence(1);

        expect(times).toHaveLength(1);
        expect(times[0].departureTime).toBe('09:00:00');
        expect(times[0].arrivalTime).toBeNull();
      });
    });
  });

  describe('BookingArrangement Factories', () => {
    describe('createContact', () => {
      it('creates a contact with defaults', () => {
        const contact = createContact();

        expect(contact.contactPerson).toBe('Test Contact');
        expect(contact.phone).toBe('+47 123 45 678');
        expect(contact.email).toBe('test@example.com');
        expect(contact.url).toBe('https://example.com/booking');
      });

      it('accepts overrides', () => {
        const contact = createContact({ contactPerson: 'John Doe' });

        expect(contact.contactPerson).toBe('John Doe');
        expect(contact.email).toBe('test@example.com');
      });
    });

    describe('createEmptyContact', () => {
      it('creates an empty contact', () => {
        const contact = createEmptyContact();

        expect(contact).toEqual({});
      });
    });

    describe('createBookingArrangement', () => {
      it('creates a booking arrangement with defaults', () => {
        const ba = createBookingArrangement();

        expect(ba.bookingContact).toBeDefined();
        expect(ba.bookingMethods).toContain(BOOKING_METHOD.CALL_OFFICE);
        expect(ba.bookingMethods).toContain(BOOKING_METHOD.ONLINE);
        expect(ba.bookingNote).toBe('Book at least 1 hour in advance');
        expect(ba.latestBookingTime).toBe('08:00:00');
        expect(ba.minimumBookingPeriod).toBe('PT1H');
      });
    });

    describe('createMinimalBookingArrangement', () => {
      it('creates a minimal booking arrangement with only phone booking', () => {
        const ba = createMinimalBookingArrangement();

        expect(ba.bookingMethods).toEqual([BOOKING_METHOD.CALL_OFFICE]);
        // Note: deepMerge skips undefined values, so these still have defaults
        // The minimal arrangement just has fewer booking methods
        expect(ba.bookingContact).toBeDefined();
      });
    });

    describe('createOnlineBookingArrangement', () => {
      it('creates an online booking arrangement', () => {
        const ba = createOnlineBookingArrangement();

        expect(ba.bookingMethods).toEqual([BOOKING_METHOD.ONLINE]);
        expect(ba.bookingNote).toBe('Book online at example.com');
      });
    });
  });

  describe('DayType Factories', () => {
    describe('createOperatingPeriod', () => {
      it('creates operating period from today', () => {
        const op = createOperatingPeriod();

        const today = new Date().toISOString().split('T')[0];
        expect(op.fromDate).toBe(today);
        expect(op.toDate).toBeDefined();
      });

      it('accepts overrides', () => {
        const op = createOperatingPeriod({
          fromDate: '2024-01-01',
          toDate: '2024-12-31',
        });

        expect(op.fromDate).toBe('2024-01-01');
        expect(op.toDate).toBe('2024-12-31');
      });
    });

    describe('createDayTypeAssignment', () => {
      it('creates available assignment by default', () => {
        const dta = createDayTypeAssignment();

        expect(dta.id).toBe('TST:DayTypeAssignment:1');
        expect(dta.isAvailable).toBe(true);
        expect(dta.operatingPeriod).toBeDefined();
      });
    });

    describe('createUnavailableDayTypeAssignment', () => {
      it('creates unavailable assignment', () => {
        const dta = createUnavailableDayTypeAssignment();

        expect(dta.isAvailable).toBe(false);
      });
    });

    describe('createDayType', () => {
      it('creates weekday day type by default', () => {
        const dt = createDayType();

        expect(dt.id).toBe('TST:DayType:1');
        expect(dt.name).toBe('Weekdays');
        expect(dt.daysOfWeek).toHaveLength(5);
        expect(dt.daysOfWeek).toContain(DAY_OF_WEEK.MONDAY);
        expect(dt.daysOfWeek).toContain(DAY_OF_WEEK.FRIDAY);
        expect(dt.daysOfWeek).not.toContain(DAY_OF_WEEK.SATURDAY);
        expect(dt.dayTypeAssignments).toHaveLength(1);
      });

      it('accepts overrides', () => {
        const dt = createDayType({ name: 'Custom' });

        expect(dt.name).toBe('Custom');
      });
    });

    describe('createWeekendDayType', () => {
      it('creates weekend day type', () => {
        const dt = createWeekendDayType();

        expect(dt.name).toBe('Weekends');
        expect(dt.daysOfWeek).toHaveLength(2);
        expect(dt.daysOfWeek).toContain(DAY_OF_WEEK.SATURDAY);
        expect(dt.daysOfWeek).toContain(DAY_OF_WEEK.SUNDAY);
      });
    });

    describe('createSingleDayType', () => {
      it('creates day type for a specific day', () => {
        const dt = createSingleDayType(DAY_OF_WEEK.WEDNESDAY);

        expect(dt.name).toBe('Wednesday');
        expect(dt.daysOfWeek).toEqual([DAY_OF_WEEK.WEDNESDAY]);
      });
    });

    describe('createExpiredDayType', () => {
      it('creates day type with past operating period', () => {
        const dt = createExpiredDayType();
        const today = new Date();
        const toDate = new Date(
          dt.dayTypeAssignments[0].operatingPeriod.toDate,
        );

        expect(dt.name).toBe('Expired');
        expect(toDate < today).toBe(true);
      });
    });

    describe('createFutureDayType', () => {
      it('creates day type with future operating period', () => {
        const dt = createFutureDayType();
        const today = new Date();
        const fromDate = new Date(
          dt.dayTypeAssignments[0].operatingPeriod.fromDate,
        );

        expect(dt.name).toBe('Future');
        expect(fromDate > today).toBe(true);
      });
    });

    describe('createEmptyDayType', () => {
      it('creates empty day type for form initialization', () => {
        const dt = createEmptyDayType();

        expect(dt.daysOfWeek).toEqual([]);
        expect(dt.dayTypeAssignments).toEqual([]);
      });
    });
  });

  describe('StopPoint Factories', () => {
    describe('createPolygonGeoJSON', () => {
      it('creates a valid closed polygon', () => {
        const geo = createPolygonGeoJSON();

        expect(geo.type).toBe('Polygon');
        expect(geo.coordinates).toHaveLength(5);
        // First and last coordinates should be the same (closed polygon)
        expect(geo.coordinates![0]).toEqual(geo.coordinates![4]);
      });
    });

    describe('createFlexibleArea', () => {
      it('creates a flexible area with polygon', () => {
        const area = createFlexibleArea();

        expect(area.id).toBe('TST:FlexibleArea:1');
        expect(area.name).toBe('Test Flexible Area');
        expect(area.polygon).toBeDefined();
        expect(area.polygon?.type).toBe('Polygon');
      });
    });

    describe('createFlexibleStopPlace', () => {
      it('creates a flexible stop place with area', () => {
        const fsp = createFlexibleStopPlace();

        expect(fsp.id).toBe('TST:FlexibleStopPlace:1');
        expect(fsp.name).toBe('Test Flexible Stop');
        expect(fsp.transportMode).toBe('bus');
        expect(fsp.flexibleArea).toBeDefined();
        expect(fsp.flexibleAreas).toHaveLength(1);
      });
    });

    describe('createQuayStopPoint', () => {
      it('creates a quay-based stop point', () => {
        const sp = createQuayStopPoint();

        expect(sp.id).toBe('TST:StopPointInJourneyPattern:1');
        expect(sp.key).toHaveLength(12);
        expect(sp.quayRef).toBe('TST:Quay:1');
        expect(sp.flexibleStopPlace).toBeUndefined();
        expect(sp.forBoarding).toBe(true);
        expect(sp.forAlighting).toBe(true);
      });

      it('uses provided quay ref', () => {
        const sp = createQuayStopPoint('NSR:Quay:1234');

        expect(sp.quayRef).toBe('NSR:Quay:1234');
      });
    });

    describe('createFlexibleStopPoint', () => {
      it('creates a flexible stop point', () => {
        const sp = createFlexibleStopPoint();

        expect(sp.quayRef).toBeNull();
        expect(sp.flexibleStopPlace).toBeDefined();
        expect(sp.flexibleStopPlaceRef).toBeDefined();
        expect(sp.bookingArrangement).toBeDefined();
      });
    });

    describe('createFirstStopPoint', () => {
      it('creates boarding-only stop point', () => {
        const sp = createFirstStopPoint();

        expect(sp.forBoarding).toBe(true);
        expect(sp.forAlighting).toBe(false);
        expect(sp.destinationDisplay?.frontText).toBe('Terminus');
      });
    });

    describe('createLastStopPoint', () => {
      it('creates alighting-only stop point', () => {
        const sp = createLastStopPoint();

        expect(sp.forBoarding).toBe(false);
        expect(sp.forAlighting).toBe(true);
        expect(sp.destinationDisplay).toBeNull();
      });
    });

    describe('createStopPointSequence', () => {
      it('creates sequence with correct boarding/alighting flags', () => {
        const stops = createStopPointSequence(3);

        expect(stops).toHaveLength(3);

        // First stop: boarding only
        expect(stops[0].forBoarding).toBe(true);
        expect(stops[0].forAlighting).toBe(false);

        // Middle stop: both
        expect(stops[1].forBoarding).toBe(true);
        expect(stops[1].forAlighting).toBe(true);

        // Last stop: alighting only
        expect(stops[2].forBoarding).toBe(false);
        expect(stops[2].forAlighting).toBe(true);
      });

      it('uses provided quay refs', () => {
        const quayRefs = ['NSR:Quay:1', 'NSR:Quay:2'];
        const stops = createStopPointSequence(2, quayRefs);

        expect(stops[0].quayRef).toBe('NSR:Quay:1');
        expect(stops[1].quayRef).toBe('NSR:Quay:2');
      });
    });

    describe('createFlexibleStopPointSequence', () => {
      it('creates flexible stop point sequence', () => {
        const stops = createFlexibleStopPointSequence(3);

        expect(stops).toHaveLength(3);

        // All stops should have flexible stop places
        stops.forEach((stop) => {
          expect(stop.flexibleStopPlace).toBeDefined();
          expect(stop.quayRef).toBeNull();
        });

        // First stop: boarding only
        expect(stops[0].forBoarding).toBe(true);
        expect(stops[0].forAlighting).toBe(false);

        // Middle stop: both
        expect(stops[1].forBoarding).toBe(true);
        expect(stops[1].forAlighting).toBe(true);

        // Last stop: alighting only
        expect(stops[2].forBoarding).toBe(false);
        expect(stops[2].forAlighting).toBe(true);
      });
    });
  });
});
