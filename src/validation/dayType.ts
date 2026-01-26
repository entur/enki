import { getDayOfWeek } from '@internationalized/date';
import { parseISOToCalendarDate } from 'utils/dates';
import DayType from 'model/DayType';

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const validateDayType = (dayType: DayType) => {
  const daysOfWeek =
    dayType.daysOfWeek?.map((dow) => WEEKDAYS.indexOf(dow)) || [];

  return dayType.dayTypeAssignments.every((dta) => {
    let from = parseISOToCalendarDate(dta.operatingPeriod.fromDate);
    const to = parseISOToCalendarDate(dta.operatingPeriod.toDate);

    // If dates can't be parsed (e.g., during year editing), treat as invalid
    if (!from || !to) {
      return false;
    }

    // Loop while from <= to
    while (from.compare(to) <= 0) {
      // getDayOfWeek with 'en-US' locale returns Sunday=0, matching WEEKDAYS array
      if (daysOfWeek.includes(getDayOfWeek(from, 'en-US'))) {
        return true;
      }
      from = from.add({ days: 1 });
    }

    return false;
  });
};

export const validateDayTypes = (dayTypes?: DayType[]) => {
  return (dayTypes && dayTypes.every(validateDayType)) || false;
};
