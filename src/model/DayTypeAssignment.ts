import Base from './base/Base';
import OperatingPeriod from './OperatingPeriod';

export type DayTypeAssignmentProps = {
  isAvailable?: boolean;
  date?: string;
  operatingPeriod?: OperatingPeriod | null;
};

class DayTypeAssignment extends Base {
  isAvailable: boolean;
  date: string | undefined;
  operatingPeriod: OperatingPeriod | null;

  constructor(data: DayTypeAssignmentProps) {
    super();

    this.isAvailable = data.isAvailable || false;
    this.date = data.date || undefined;
    this.operatingPeriod = data.operatingPeriod
      ? {
          fromDate: data.operatingPeriod.fromDate,
          toDate: data.operatingPeriod.toDate
        }
      : null;
  }
}

export default DayTypeAssignment;
