import Base from './Base';

class FlexibleLine extends Base {
  constructor(data = {}) {
    super();

    this.authority = data.authority || '';
    this.operator = data.operator || '';
    this.lineNumber = data.lineNumber || '';
    this.dayTypes = data.dayTypes || '';
    this.bookingReference = data.bookingReference || '';
    this.stopPlace = data.stopPlace || '';
  }
}

export default FlexibleLine;
