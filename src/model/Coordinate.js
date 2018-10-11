import Base from './base/Base';

class Coordinate extends Base {
  constructor(data = {}) {
    super();

    this.lat = data.lat || '';
    this.lng = data.lng || '';
  }
}

export default Coordinate;
