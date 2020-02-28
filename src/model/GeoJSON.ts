import Base from './base/Base';

type Data = {
  type: string;
  coordinates?: number[];
};

class GeoJSON extends Base {
  type: string;
  coordinates: number[];
  constructor(data: Data) {
    super();

    this.type = data.type;
    this.coordinates = data.coordinates || [];
  }
}

export default GeoJSON;
