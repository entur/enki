import { parseTime, Time, CalendarDateTime } from '@internationalized/date';
import { getCurrentDateTime } from 'utils/dates';

/**
 * Add days to a Time object, returning a CalendarDateTime
 */
const addDays = (time: Time, days: number): CalendarDateTime =>
  getCurrentDateTime()
    .set({
      hour: time.hour,
      minute: time.minute,
    })
    .add({ days });

/**
 * Check if a passing time is before another passing time, accounting for day offsets
 */
export const isBefore = (
  passingTime: string | undefined,
  dayOffset: number | undefined,
  nextPassingTime: string | undefined,
  nextDayOffset: number | undefined,
) => {
  if (!passingTime || !nextPassingTime) return false;

  try {
    const time = parseTime(passingTime);
    const nextTime = parseTime(nextPassingTime);
    const date = addDays(time, dayOffset ?? 0);
    const nextDate = addDays(nextTime, nextDayOffset ?? 0);
    return date.compare(nextDate) < 0;
  } catch (e) {
    return false;
  }
};

/**
 * Check if a passing time is after another passing time, accounting for day offsets
 */
export const isAfter = (
  passingTime: string | undefined,
  dayOffset: number | undefined,
  nextPassingTime: string | undefined,
  nextDayOffset: number | undefined,
) => {
  if (!passingTime || !nextPassingTime) return false;

  try {
    const time = parseTime(passingTime);
    const nextTime = parseTime(nextPassingTime);
    const date = addDays(time, dayOffset ?? 0);
    const nextDate = addDays(nextTime, nextDayOffset ?? 0);
    return date.compare(nextDate) > 0;
  } catch (e) {
    return false;
  }
};
