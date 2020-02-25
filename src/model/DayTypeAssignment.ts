import Base from './base/Base';
import OperatingPeriod from './OperatingPeriod';

export type DayTypeAssignmentProps = {
  isAvailable?: boolean;
  date?: string;
  operatingPeriod: OperatingPeriod;
};

class DayTypeAssignment extends Base {
  isAvailable: boolean;
  date: string | undefined;
  operatingPeriod: OperatingPeriod | null;

  constructor(data: DayTypeAssignmentProps) {
    super();
    const { operatingPeriod } = data;

    this.isAvailable = data.isAvailable || false;
    this.date = data.date || undefined;
    this.operatingPeriod = operatingPeriod
      ? { fromDate: operatingPeriod.fromDate, toDate: operatingPeriod.toDate }
      : null;
  }
}

export default DayTypeAssignment;
