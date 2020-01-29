import Base from './base/Base';
import OperatingPeriod from './OperatingPeriod';

class DayTypeAssignment extends Base {
  constructor(data = {}) {
    super();

    this.isAvailable = data.isAvailable || false;
    this.date = data.date || undefined;
    this.operatingPeriod = data.operatingPeriod
      ? new OperatingPeriod(data.operatingPeriod)
      : null;
  }
}

export default DayTypeAssignment;
