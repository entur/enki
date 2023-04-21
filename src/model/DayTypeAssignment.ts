import moment from 'moment';
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
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
  },
});

export default DayTypeAssignment;
