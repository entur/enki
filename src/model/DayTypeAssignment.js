import Base from './base/Base';
import OperatingPeriod from './OperatingPeriod';
import uuid from 'uuid';

class DayTypeAssignment extends Base {
  constructor(data = {}) {
    super();

    this.isAvailable = data.isAvailable || false;
    this.date = data.date;
    this.operatingPeriod = data.operatingPeriod
      ? new OperatingPeriod(data.operatingPeriod)
      : null;
    this.id = uuid.v4();
  }
}

export default DayTypeAssignment;
