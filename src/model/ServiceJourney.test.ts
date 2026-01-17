import { describe, it, expect, beforeEach } from 'vitest';
import { serviceJourneyToPayload } from './ServiceJourney';
import {
  createServiceJourney,
  createServiceJourneyWithPassingTimes,
  createServiceJourneyWithDayTypes,
  createEmptyServiceJourney,
  createPassingTime,
  createDayType,
  createTime,
  resetIdCounters,
} from 'test/factories';
import { BOOKING_METHOD, PURCHASE_WHEN } from './enums';

describe('serviceJourneyToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('ID handling', () => {
    it('removes id when it starts with new_', () => {
      const sj = createServiceJourney({
        id: 'new_ServiceJourney_1',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.id).toBeUndefined();
    });

    it('preserves id when it does not start with new_', () => {
      const sj = createServiceJourney({
        id: 'TST:ServiceJourney:1',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.id).toBe('TST:ServiceJourney:1');
    });

    it('handles id that contains new_ but does not start with it', () => {
      const sj = createServiceJourney({
        id: 'TST:ServiceJourney:new_123',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.id).toBe('TST:ServiceJourney:new_123');
    });

    it('handles service journey without id property', () => {
      const sj: any = {
        passingTimes: [],
      };
      // Ensure there's no id property at all
      expect(sj.id).toBeUndefined();

      const result = serviceJourneyToPayload(sj);

      // With no id property, the result should also have no id
      expect(result.id).toBeUndefined();
    });
  });

  describe('dayTypes conversion', () => {
    it('converts dayTypes array to dayTypesRefs', () => {
      const sj = createServiceJourneyWithDayTypes({
        dayTypes: [
          createDayType({ id: 'TST:DayType:1' }),
          createDayType({ id: 'TST:DayType:2' }),
        ],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.dayTypesRefs).toEqual(['TST:DayType:1', 'TST:DayType:2']);
      expect(result.dayTypes).toBeUndefined();
    });

    it('returns undefined dayTypesRefs when dayTypes is undefined', () => {
      const sj = createServiceJourney();
      delete (sj as any).dayTypes;

      const result = serviceJourneyToPayload(sj);

      expect(result.dayTypesRefs).toBeUndefined();
    });

    it('returns empty dayTypesRefs when dayTypes is empty', () => {
      const sj = createServiceJourney({
        dayTypes: [],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.dayTypesRefs).toEqual([]);
    });

    it('extracts ids from dayTypes objects', () => {
      const sj = createServiceJourneyWithDayTypes({
        dayTypes: [
          createDayType({
            id: 'TST:DayType:weekday',
            name: 'Weekdays',
          }),
        ],
      });

      const result = serviceJourneyToPayload(sj);

      // Should only have the ID, not the full object
      expect(result.dayTypesRefs).toEqual(['TST:DayType:weekday']);
    });
  });

  describe('notices filtering', () => {
    it('preserves notices with text', () => {
      const sj = createServiceJourney({
        notices: [{ text: 'Valid notice 1' }, { text: 'Valid notice 2' }],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.notices).toEqual([
        { text: 'Valid notice 1' },
        { text: 'Valid notice 2' },
      ]);
    });

    it('filters out notices with empty text', () => {
      const sj = createServiceJourney({
        notices: [
          { text: 'Valid notice' },
          { text: '' },
          { text: 'Another valid' },
        ],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });

    it('filters out notices without text property', () => {
      const sj = createServiceJourney({
        notices: [
          { text: 'Valid notice' },
          {} as any,
          { text: 'Another valid' },
        ],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.notices).toEqual([
        { text: 'Valid notice' },
        { text: 'Another valid' },
      ]);
    });

    it('filters out null/undefined notices', () => {
      const sj = createServiceJourney({
        notices: [{ text: 'Valid notice' }, null as any, undefined as any],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.notices).toEqual([{ text: 'Valid notice' }]);
    });

    it('returns empty array when all notices are invalid', () => {
      const sj = createServiceJourney({
        notices: [{ text: '' }, {} as any, null as any],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.notices).toEqual([]);
    });

    it('handles undefined notices array', () => {
      const sj = createServiceJourney();
      delete (sj as any).notices;

      const result = serviceJourneyToPayload(sj);

      expect(result.notices).toBeUndefined();
    });
  });

  describe('passingTimes transformation', () => {
    it('transforms passing times using passingTimeToPayload', () => {
      const sj = createServiceJourneyWithPassingTimes(3, 9, 15);

      const result = serviceJourneyToPayload(sj);

      expect(result.passingTimes).toHaveLength(3);
      // First stop should have departure only (created with arrivalTime=null)
      expect(result.passingTimes[0].departureTime).toBe('09:00:00');
      expect(result.passingTimes[0].arrivalTime).toBeNull();
      // Middle stop: factory creates same arrival/departure time,
      // which triggers "same time not last stop" path -> departure only
      expect(result.passingTimes[1].departureTime).toBe('09:15:00');
      expect(result.passingTimes[1].arrivalTime).toBeNull();
      // Last stop should have arrival only (created with departureTime=null)
      expect(result.passingTimes[2].arrivalTime).toBe('09:30:00');
      expect(result.passingTimes[2].departureTime).toBeNull();
    });

    it('handles single passing time', () => {
      const sj = createServiceJourney({
        passingTimes: [
          createPassingTime({
            arrivalTime: createTime(10, 0),
            departureTime: createTime(10, 0),
          }),
        ],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.passingTimes).toHaveLength(1);
      // Single stop is both first and last - the code returns arrival for last
      expect(result.passingTimes[0].arrivalTime).toBe('10:00:00');
    });

    it('handles empty passing times array', () => {
      const sj = createEmptyServiceJourney();

      const result = serviceJourneyToPayload(sj);

      expect(result.passingTimes).toEqual([]);
    });

    it('preserves passing time index context', () => {
      // Create a 5-stop journey with different arrival/departure times at middle stops
      const sj = createServiceJourney({
        passingTimes: [
          createPassingTime({
            arrivalTime: null,
            departureTime: createTime(8, 0),
          }),
          createPassingTime({
            arrivalTime: createTime(8, 10),
            departureTime: createTime(8, 12), // Different from arrival
          }),
          createPassingTime({
            arrivalTime: createTime(8, 20),
            departureTime: createTime(8, 22), // Different from arrival
          }),
          createPassingTime({
            arrivalTime: createTime(8, 30),
            departureTime: createTime(8, 32), // Different from arrival
          }),
          createPassingTime({
            arrivalTime: createTime(8, 40),
            departureTime: null,
          }),
        ],
      });

      const result = serviceJourneyToPayload(sj);

      // First stop: departure only
      expect(result.passingTimes[0].departureTime).not.toBeNull();
      expect(result.passingTimes[0].arrivalTime).toBeNull();

      // Intermediate stops: both times (indices 1, 2, 3)
      for (let i = 1; i < 4; i++) {
        expect(result.passingTimes[i].arrivalTime).not.toBeNull();
        expect(result.passingTimes[i].departureTime).not.toBeNull();
      }

      // Last stop: arrival only
      expect(result.passingTimes[4].arrivalTime).not.toBeNull();
      expect(result.passingTimes[4].departureTime).toBeNull();
    });
  });

  describe('property passthrough', () => {
    it('preserves name property', () => {
      const sj = createServiceJourney({
        name: 'Morning Express',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.name).toBe('Morning Express');
    });

    it('preserves description property', () => {
      const sj = createServiceJourney({
        description: 'A test journey description',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.description).toBe('A test journey description');
    });

    it('preserves privateCode property', () => {
      const sj = createServiceJourney({
        privateCode: 'PRIV001',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.privateCode).toBe('PRIV001');
    });

    it('preserves publicCode property', () => {
      const sj = createServiceJourney({
        publicCode: 'PUB123',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.publicCode).toBe('PUB123');
    });

    it('preserves operatorRef property', () => {
      const sj = createServiceJourney({
        operatorRef: 'TST:Operator:1',
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.operatorRef).toBe('TST:Operator:1');
    });

    it('preserves bookingArrangement property', () => {
      const sj = createServiceJourney({
        bookingArrangement: {
          bookingContact: { phone: '12345678' },
          bookingMethods: [BOOKING_METHOD.CALL_OFFICE],
          bookWhen: PURCHASE_WHEN.UNTIL_PREVIOUS_DAY,
          latestBookingTime: createTime(12, 0),
        },
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.bookingArrangement).toEqual({
        bookingContact: { phone: '12345678' },
        bookingMethods: [BOOKING_METHOD.CALL_OFFICE],
        bookWhen: PURCHASE_WHEN.UNTIL_PREVIOUS_DAY,
        latestBookingTime: createTime(12, 0),
      });
    });

    it('preserves null values for optional properties', () => {
      const sj = createServiceJourney({
        description: null,
        privateCode: null,
        publicCode: null,
        operatorRef: null,
        bookingArrangement: null,
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.description).toBeNull();
      expect(result.privateCode).toBeNull();
      expect(result.publicCode).toBeNull();
      expect(result.operatorRef).toBeNull();
      expect(result.bookingArrangement).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles minimal service journey', () => {
      const sj: any = {
        passingTimes: [],
      };

      const result = serviceJourneyToPayload(sj);

      expect(result.passingTimes).toEqual([]);
      expect(result.dayTypes).toBeUndefined();
    });

    it('handles service journey with all properties', () => {
      const sj = createServiceJourney({
        id: 'TST:ServiceJourney:full',
        name: 'Full Service Journey',
        description: 'Complete test journey',
        privateCode: 'PRIV',
        publicCode: 'PUB',
        operatorRef: 'TST:Operator:1',
        bookingArrangement: {
          bookingMethods: [BOOKING_METHOD.CALL_OFFICE],
        },
        passingTimes: [
          createPassingTime({
            arrivalTime: createTime(9, 0),
            departureTime: createTime(9, 0),
          }),
          createPassingTime({
            arrivalTime: createTime(10, 0),
            departureTime: createTime(10, 0),
          }),
        ],
        dayTypes: [createDayType({ id: 'TST:DayType:1' })],
        notices: [{ text: 'Important notice' }],
      });

      const result = serviceJourneyToPayload(sj);

      expect(result.id).toBe('TST:ServiceJourney:full');
      expect(result.name).toBe('Full Service Journey');
      expect(result.description).toBe('Complete test journey');
      expect(result.privateCode).toBe('PRIV');
      expect(result.publicCode).toBe('PUB');
      expect(result.operatorRef).toBe('TST:Operator:1');
      expect(result.bookingArrangement).toEqual({
        bookingMethods: [BOOKING_METHOD.CALL_OFFICE],
      });
      expect(result.passingTimes).toHaveLength(2);
      expect(result.dayTypesRefs).toEqual(['TST:DayType:1']);
      expect(result.dayTypes).toBeUndefined();
      expect(result.notices).toEqual([{ text: 'Important notice' }]);
    });

    it('correctly mutates input object when removing new_ id', () => {
      const sj = createServiceJourney({
        id: 'new_ServiceJourney_1',
      });

      // The function mutates the input by deleting id
      serviceJourneyToPayload(sj);

      // The original object's id should be deleted
      expect(sj.id).toBeUndefined();
    });
  });
});
