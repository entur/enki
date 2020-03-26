import OperatingPeriod from './OperatingPeriod';

export type DayTypeAssignment = {
  isAvailable: boolean;
  date?: string;
  operatingPeriod: OperatingPeriod;
};

export default DayTypeAssignment;
