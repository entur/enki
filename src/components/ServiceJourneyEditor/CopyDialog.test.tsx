import { copyServiceJourney } from './CopyDialog';
import * as duration from 'duration-fns';

describe('copyServiceJourney', () => {
  it('should copy correctly', () => {
    const copies = copyServiceJourney(
      {
        passingTimes: [
          {
            arrivalTime: '11:00:00',
            arrivalDayOffset: 0,
            departureTime: '11:00:00',
            departureDayOffset: 0,
          },
          {
            arrivalTime: '11:03:00',
            arrivalDayOffset: 0,
            departureTime: '11:03:00',
            departureDayOffset: 0,
          },
          {
            arrivalTime: '11:05:00',
            arrivalDayOffset: 0,
            departureTime: '11:05:00',
            departureDayOffset: 0,
          },
          {
            arrivalTime: '11:10:00',
            arrivalDayOffset: 0,
            departureTime: '11:10:00',
            departureDayOffset: 0,
          },
        ],
      },
      [],
      'Departure <% time %>',
      '12:00:00',
      0,
      '13:00:00',
      0,
      duration.parse('PT10M')
    );

    expect(copies.length).toBe(7);

    expect(copies[0].passingTimes[0].arrivalTime).toBe('12:00:00');
    expect(copies[0].passingTimes[0].departureTime).toBe('12:00:00');
    expect(copies[0].passingTimes[1].arrivalTime).toBe('12:03:00');
    expect(copies[0].passingTimes[1].departureTime).toBe('12:03:00');
    expect(copies[0].passingTimes[2].arrivalTime).toBe('12:05:00');
    expect(copies[0].passingTimes[2].departureTime).toBe('12:05:00');
    expect(copies[0].passingTimes[3].arrivalTime).toBe('12:10:00');
    expect(copies[0].passingTimes[3].departureTime).toBe('12:10:00');
  });
});
