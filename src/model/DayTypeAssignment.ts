import OperatingPeriod from './OperatingPeriod';
import moment from 'moment';

export type DayTypeAssignment = {
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
