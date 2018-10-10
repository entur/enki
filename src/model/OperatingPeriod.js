import Base from './base/Base';

class OperatingPeriod extends Base {
  constructor(data = {}) {
    super();

    this.fromDate = data.fromDate || '';
    this.toDate = data.toDate || '';
  }
}

export default OperatingPeriod;
