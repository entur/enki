import { CalendarDate } from '@internationalized/date';
import JourneyPattern from 'model/JourneyPattern';
import OperatingPeriod from 'model/OperatingPeriod';
import { getCurrentDate, parseISOToCalendarDate } from 'utils/dates';

/**
 * Represents a date range for line availability
 */
export type Availability = {
  from: CalendarDate;
  to: CalendarDate;
};

/**
 * Line availability status based on days until unavailable
 */
export type AvailabilityStatus = 'negative' | 'positive' | 'neutral';

/**
 * Result of calculating line status from availability
 */
export type LineAvailabilityResult = {
  availability: Availability;
  status: AvailabilityStatus;
  daysUntilUnavailable: number;
};

/**
 * Compute the widest date range encompassing both inputs (union of ranges)
 */
export const unionAvailability = (
  left: Availability,
  right: Availability,
): Availability => {
  return {
    from: right.from.compare(left.from) < 0 ? right.from : left.from,
    to: right.to.compare(left.to) > 0 ? right.to : left.to,
  };
};

/**
 * Merge an operating period into an existing availability window
 * If no existing availability, creates one from the operating period
 */
export const mergeAvailability = (
  availability: Availability | undefined,
  operatingPeriod: OperatingPeriod,
): Availability => {
  const fromDate = parseISOToCalendarDate(operatingPeriod.fromDate);
  const toDate = parseISOToCalendarDate(operatingPeriod.toDate);

  if (!fromDate || !toDate) {
    throw new Error('Invalid operating period dates');
  }

  const availabilityFromOperatingPeriod: Availability = {
    from: fromDate,
    to: toDate,
  };

  return availability
    ? unionAvailability(availability, availabilityFromOperatingPeriod)
    : availabilityFromOperatingPeriod;
};

/**
 * Calculate the overall availability window for journey patterns
 * by traversing all service journeys, day types, and day type assignments
 *
 * @throws Error if no valid operating periods found
 */
export const getJourneyPatternsAvailability = (
  journeyPatterns?: JourneyPattern[],
): Availability => {
  const operatingPeriods = (journeyPatterns ?? [])
    .flatMap((jp) => jp.serviceJourneys)
    .flatMap((sj) => sj.dayTypes ?? [])
    .flatMap((dt) => dt.dayTypeAssignments)
    .map((dta) => dta.operatingPeriod);

  if (operatingPeriods.length === 0) {
    throw new Error('Unable to calculate availability for line');
  }

  return operatingPeriods.reduce<Availability>(
    (acc, period) => mergeAvailability(acc, period),
    {
      from: parseISOToCalendarDate(operatingPeriods[0].fromDate)!,
      to: parseISOToCalendarDate(operatingPeriods[0].toDate)!,
    },
  );
};

/**
 * Calculate line availability status based on journey patterns
 *
 * @param journeyPatterns - Journey patterns to analyze
 * @param referenceDate - Date to calculate from (defaults to current date)
 * @returns Availability info including status and days until unavailable
 */
export const calculateLineAvailability = (
  journeyPatterns?: JourneyPattern[],
  referenceDate?: CalendarDate,
): LineAvailabilityResult => {
  const today = referenceDate ?? getCurrentDate();
  const availability = getJourneyPatternsAvailability(journeyPatterns);
  const daysUntilUnavailable = availability.to.compare(today);

  let status: AvailabilityStatus;
  if (daysUntilUnavailable > 121) {
    status = 'positive';
  } else if (daysUntilUnavailable > 0) {
    status = 'neutral';
  } else {
    status = 'negative';
  }

  return {
    availability,
    status,
    daysUntilUnavailable,
  };
};

/**
 * Convert availability status to human-readable text
 */
export const mapStatusToText = (status: AvailabilityStatus): string => {
  switch (status) {
    case 'positive':
      return 'Available next 120 days';
    case 'neutral':
      return 'Becomes unavailable in less than 120 days';
    case 'negative':
      return 'No longer available';
  }
};
