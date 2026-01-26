import DayType from 'model/DayType';
import DayTypeAssignment from 'model/DayTypeAssignment';
import OperatingPeriod from 'model/OperatingPeriod';
import { DAY_OF_WEEK } from 'model/enums';
import { DeepPartial } from './types';
import { createTestId, createDate, deepMerge } from './utils';

/**
 * Create an OperatingPeriod with sensible defaults
 * Default: Today to 30 days from now
 */
export const createOperatingPeriod = (
  overrides?: DeepPartial<OperatingPeriod>,
): OperatingPeriod => {
  const defaults: OperatingPeriod = {
    fromDate: createDate(0),
    toDate: createDate(30),
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a DayTypeAssignment with sensible defaults
 */
export const createDayTypeAssignment = (
  overrides?: DeepPartial<DayTypeAssignment>,
): DayTypeAssignment => {
  const defaults: DayTypeAssignment = {
    id: createTestId('DayTypeAssignment'),
    isAvailable: true,
    operatingPeriod: createOperatingPeriod(),
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create an unavailable DayTypeAssignment (for testing exclusions)
 */
export const createUnavailableDayTypeAssignment = (
  overrides?: DeepPartial<DayTypeAssignment>,
): DayTypeAssignment => {
  return createDayTypeAssignment({
    isAvailable: false,
    ...overrides,
  });
};

/**
 * Create a DayType with sensible defaults
 * Default: Weekdays (Monday-Friday)
 */
export const createDayType = (overrides?: DeepPartial<DayType>): DayType => {
  const defaults: DayType = {
    id: createTestId('DayType'),
    name: 'Weekdays',
    daysOfWeek: [
      DAY_OF_WEEK.MONDAY,
      DAY_OF_WEEK.TUESDAY,
      DAY_OF_WEEK.WEDNESDAY,
      DAY_OF_WEEK.THURSDAY,
      DAY_OF_WEEK.FRIDAY,
    ],
    dayTypeAssignments: [createDayTypeAssignment()],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a weekend DayType
 */
export const createWeekendDayType = (
  overrides?: DeepPartial<DayType>,
): DayType => {
  return createDayType({
    name: 'Weekends',
    daysOfWeek: [DAY_OF_WEEK.SATURDAY, DAY_OF_WEEK.SUNDAY],
    ...overrides,
  });
};

/**
 * Create a DayType for a specific day
 */
export const createSingleDayType = (
  day: DAY_OF_WEEK,
  overrides?: DeepPartial<DayType>,
): DayType => {
  return createDayType({
    name: day.charAt(0).toUpperCase() + day.slice(1),
    daysOfWeek: [day],
    ...overrides,
  });
};

/**
 * Create an expired DayType (for testing unavailable lines)
 */
export const createExpiredDayType = (
  overrides?: DeepPartial<DayType>,
): DayType => {
  return createDayType({
    name: 'Expired',
    dayTypeAssignments: [
      createDayTypeAssignment({
        operatingPeriod: {
          fromDate: createDate(-60),
          toDate: createDate(-30),
        },
      }),
    ],
    ...overrides,
  });
};

/**
 * Create a future DayType (for testing upcoming services)
 */
export const createFutureDayType = (
  overrides?: DeepPartial<DayType>,
): DayType => {
  return createDayType({
    name: 'Future',
    dayTypeAssignments: [
      createDayTypeAssignment({
        operatingPeriod: {
          fromDate: createDate(30),
          toDate: createDate(90),
        },
      }),
    ],
    ...overrides,
  });
};

/**
 * Create an empty DayType (for form initialization)
 */
export const createEmptyDayType = (): DayType => ({
  daysOfWeek: [],
  dayTypeAssignments: [],
});
