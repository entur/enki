import Base from './base/Base';
import Coordinate from './Coordinate';

class GeoJSON extends Base {
  constructor(data = {}) {
    super();

    this.type = data.type || '';
    this.coordinates = (data.coordinates || []).map(c => new Coordinate(c));
  }
}

export default GeoJSON;
