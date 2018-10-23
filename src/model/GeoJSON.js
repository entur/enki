import Base from './base/Base';

class GeoJSON extends Base {
  constructor(data = {}) {
    super();

    this.type = data.type;
    this.coordinates = data.coordinates || [];
  }
}

export default GeoJSON;
