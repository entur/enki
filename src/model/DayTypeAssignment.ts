import { getCurrentDate } from '../utils/dates';
import OperatingPeriod from './OperatingPeriod';
import VersionedType from './VersionedType';

export type DayTypeAssignment = VersionedType & {
  isAvailable: boolean;
  date?: string;
  operatingPeriod: OperatingPeriod;
};

export const newDayTypeAssignment = (): DayTypeAssignment => ({
  isAvailable: true,
  operatingPeriod: {
    fromDate: getCurrentDate().toString(),
    toDate: getCurrentDate().toString(),
  },
});

export default DayTypeAssignment;
