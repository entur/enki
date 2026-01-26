import { describe, it, expect, beforeEach } from 'vitest';
import { passingTimeToPayload } from './PassingTime';
import { createPassingTime, resetIdCounters, createTime } from 'test/factories';

describe('passingTimeToPayload', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  describe('flexible service (no fixed arrival/departure times)', () => {
    it('returns earliest/latest times when no arrival or departure time', () => {
      const pt = createPassingTime({
        arrivalTime: null,
        departureTime: null,
        earliestDepartureTime: createTime(8, 0),
        earliestDepartureDayOffset: 0,
        latestArrivalTime: createTime(10, 0),
        latestArrivalDayOffset: 0,
      });

      const result = passingTimeToPayload(pt, 1, 3);

      expect(result.earliestDepartureTime).toBe('08:00:00');
      expect(result.latestArrivalTime).toBe('10:00:00');
      expect(result.arrivalTime).toBeNull();
      expect(result.departureTime).toBeNull();
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.departureDayOffset).toBe(0);
    });

    it('preserves day offsets for flexible times', () => {
      const pt = createPassingTime({
        arrivalTime: null,
        departureTime: null,
        earliestDepartureTime: createTime(23, 0),
        earliestDepartureDayOffset: 0,
        latestArrivalTime: createTime(1, 0),
        latestArrivalDayOffset: 1,
      });

      const result = passingTimeToPayload(pt, 1, 3);

      expect(result.earliestDepartureDayOffset).toBe(0);
      expect(result.latestArrivalDayOffset).toBe(1);
    });

    it('handles empty string times as flexible service', () => {
      // Note: The function checks !departureTime && !arrivalTime
      // Empty strings are falsy, so they trigger the flexible service path
      const pt = createPassingTime({
        arrivalTime: '' as unknown as null,
        departureTime: '' as unknown as null,
        earliestDepartureTime: createTime(9, 0),
        latestArrivalTime: createTime(11, 0),
      });

      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.earliestDepartureTime).toBe('09:00:00');
      expect(result.latestArrivalTime).toBe('11:00:00');
      expect(result.arrivalTime).toBeNull();
      expect(result.departureTime).toBeNull();
    });
  });

  describe('same arrival and departure time', () => {
    it('returns departure only when not last stop', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(9, 30),
        arrivalDayOffset: 0,
        departureTime: createTime(9, 30),
        departureDayOffset: 0,
      });

      // Middle stop (index 1 of 3)
      const result = passingTimeToPayload(pt, 1, 3);

      expect(result.departureTime).toBe('09:30:00');
      expect(result.departureDayOffset).toBe(0);
      expect(result.arrivalTime).toBeNull();
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.earliestDepartureTime).toBeNull();
      expect(result.latestArrivalTime).toBeNull();
    });

    it('returns arrival only when last stop', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(10, 0),
        arrivalDayOffset: 0,
        departureTime: createTime(10, 0),
        departureDayOffset: 0,
      });

      // Last stop (index 2 of 3)
      const result = passingTimeToPayload(pt, 2, 3);

      expect(result.arrivalTime).toBe('10:00:00');
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.departureTime).toBeNull();
      expect(result.departureDayOffset).toBe(0);
    });

    it('handles same time with day offset', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(0, 30),
        arrivalDayOffset: 1,
        departureTime: createTime(0, 30),
        departureDayOffset: 1,
      });

      // Last stop
      const result = passingTimeToPayload(pt, 2, 3);

      expect(result.arrivalTime).toBe('00:30:00');
      expect(result.arrivalDayOffset).toBe(1);
    });

    it('returns departure at first stop even when times match', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(9, 0),
        arrivalDayOffset: 0,
        departureTime: createTime(9, 0),
        departureDayOffset: 0,
      });

      // First stop (index 0 of 3)
      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.departureTime).toBe('09:00:00');
      expect(result.arrivalTime).toBeNull();
    });
  });

  describe('first stop (index 0)', () => {
    it('returns departure time only', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(9, 0),
        arrivalDayOffset: 0,
        departureTime: createTime(9, 5),
        departureDayOffset: 0,
      });

      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.departureTime).toBe('09:05:00');
      expect(result.departureDayOffset).toBe(0);
      expect(result.arrivalTime).toBeNull();
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.earliestDepartureTime).toBeNull();
      expect(result.latestArrivalTime).toBeNull();
    });

    it('handles departure time with day offset', () => {
      const pt = createPassingTime({
        departureTime: createTime(0, 15),
        departureDayOffset: 1,
      });

      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.departureTime).toBe('00:15:00');
      expect(result.departureDayOffset).toBe(1);
    });
  });

  describe('last stop', () => {
    it('returns arrival time only', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(10, 30),
        arrivalDayOffset: 0,
        departureTime: createTime(10, 35),
        departureDayOffset: 0,
      });

      const result = passingTimeToPayload(pt, 2, 3);

      expect(result.arrivalTime).toBe('10:30:00');
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.departureTime).toBeNull();
      expect(result.departureDayOffset).toBe(0);
    });

    it('handles overnight journey (arrival next day)', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(2, 0),
        arrivalDayOffset: 1,
        departureTime: createTime(2, 5),
        departureDayOffset: 1,
      });

      const result = passingTimeToPayload(pt, 4, 5);

      expect(result.arrivalTime).toBe('02:00:00');
      expect(result.arrivalDayOffset).toBe(1);
    });
  });

  describe('intermediate stops', () => {
    it('returns both arrival and departure times', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(9, 30),
        arrivalDayOffset: 0,
        departureTime: createTime(9, 32),
        departureDayOffset: 0,
      });

      // Middle stop (index 1 of 3)
      const result = passingTimeToPayload(pt, 1, 3);

      expect(result.arrivalTime).toBe('09:30:00');
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.departureTime).toBe('09:32:00');
      expect(result.departureDayOffset).toBe(0);
      expect(result.earliestDepartureTime).toBeNull();
      expect(result.latestArrivalTime).toBeNull();
    });

    it('handles different day offsets for arrival and departure', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(23, 55),
        arrivalDayOffset: 0,
        departureTime: createTime(0, 5),
        departureDayOffset: 1,
      });

      const result = passingTimeToPayload(pt, 2, 5);

      expect(result.arrivalTime).toBe('23:55:00');
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.departureTime).toBe('00:05:00');
      expect(result.departureDayOffset).toBe(1);
    });

    it('handles multiple intermediate stops', () => {
      const pt1 = createPassingTime({
        arrivalTime: createTime(9, 15),
        departureTime: createTime(9, 17),
      });
      const pt2 = createPassingTime({
        arrivalTime: createTime(9, 30),
        departureTime: createTime(9, 32),
      });
      const pt3 = createPassingTime({
        arrivalTime: createTime(9, 45),
        departureTime: createTime(9, 47),
      });

      // All are intermediate stops (indices 1, 2, 3 of 5)
      const result1 = passingTimeToPayload(pt1, 1, 5);
      const result2 = passingTimeToPayload(pt2, 2, 5);
      const result3 = passingTimeToPayload(pt3, 3, 5);

      // All should have both arrival and departure
      expect(result1.arrivalTime).toBe('09:15:00');
      expect(result1.departureTime).toBe('09:17:00');
      expect(result2.arrivalTime).toBe('09:30:00');
      expect(result2.departureTime).toBe('09:32:00');
      expect(result3.arrivalTime).toBe('09:45:00');
      expect(result3.departureTime).toBe('09:47:00');
    });
  });

  describe('rest properties preservation', () => {
    it('preserves id and name properties', () => {
      const pt = createPassingTime({
        id: 'TST:TimetabledPassingTime:1',
        name: 'Test Stop',
      });

      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.id).toBe('TST:TimetabledPassingTime:1');
      expect(result.name).toBe('Test Stop');
    });

    it('preserves notices array', () => {
      const pt = createPassingTime({
        notices: [{ text: 'Test notice' }],
      });

      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.notices).toEqual([{ text: 'Test notice' }]);
    });

    it('preserves description and privateCode', () => {
      const pt = createPassingTime({
        description: 'A test description',
        privateCode: 'PRIV001',
      });

      const result = passingTimeToPayload(pt, 0, 3);

      expect(result.description).toBe('A test description');
      expect(result.privateCode).toBe('PRIV001');
    });
  });

  describe('edge cases', () => {
    it('handles single stop journey (first and last)', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(9, 0),
        departureTime: createTime(9, 0),
      });

      // Single stop journey (index 0 of 1)
      const result = passingTimeToPayload(pt, 0, 1);

      // When same arrival/departure and it's the last stop (i === length - 1),
      // the function returns arrival only. Index 0 of length 1 means i === length - 1.
      expect(result.arrivalTime).toBe('09:00:00');
      expect(result.departureTime).toBeNull();
    });

    it('handles two-stop journey correctly', () => {
      const first = createPassingTime({
        departureTime: createTime(9, 0),
        arrivalTime: createTime(9, 0),
      });
      const last = createPassingTime({
        arrivalTime: createTime(10, 0),
        departureTime: createTime(10, 0),
      });

      const firstResult = passingTimeToPayload(first, 0, 2);
      const lastResult = passingTimeToPayload(last, 1, 2);

      expect(firstResult.departureTime).toBe('09:00:00');
      expect(firstResult.arrivalTime).toBeNull();
      expect(lastResult.arrivalTime).toBe('10:00:00');
      expect(lastResult.departureTime).toBeNull();
    });

    it('handles midnight crossing correctly', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(23, 59),
        arrivalDayOffset: 0,
        departureTime: createTime(0, 1),
        departureDayOffset: 1,
      });

      const result = passingTimeToPayload(pt, 1, 3);

      expect(result.arrivalTime).toBe('23:59:00');
      expect(result.arrivalDayOffset).toBe(0);
      expect(result.departureTime).toBe('00:01:00');
      expect(result.departureDayOffset).toBe(1);
    });

    it('handles multi-day journey (day offset > 1)', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(6, 0),
        arrivalDayOffset: 2,
        departureTime: createTime(6, 10),
        departureDayOffset: 2,
      });

      const result = passingTimeToPayload(pt, 1, 3);

      expect(result.arrivalDayOffset).toBe(2);
      expect(result.departureDayOffset).toBe(2);
    });

    it('clears earliestDeparture and latestArrival offsets for fixed-time stops', () => {
      const pt = createPassingTime({
        arrivalTime: createTime(9, 0),
        departureTime: createTime(9, 5),
        earliestDepartureTime: createTime(8, 0),
        earliestDepartureDayOffset: 1, // Should be reset to 0
        latestArrivalTime: createTime(10, 0),
        latestArrivalDayOffset: 1, // Should be reset to 0
      });

      const result = passingTimeToPayload(pt, 1, 3);

      // For fixed-time stops, flexible time fields should be null with 0 offset
      expect(result.earliestDepartureTime).toBeNull();
      expect(result.earliestDepartureDayOffset).toBe(0);
      expect(result.latestArrivalTime).toBeNull();
      expect(result.latestArrivalDayOffset).toBe(0);
    });
  });
});
