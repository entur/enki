import Versioned from './base/Versioned';
import GeoJSON from './GeoJSON';
import { GEOMETRY_TYPE } from './enums';

type Data = {
  name?: string;
  description?: string;
  privateCode?: string;
  polygon?: GeoJSON;
};

class FlexibleArea extends Versioned {
  name: string | undefined;
  description: string | undefined;
  privateCode: string | undefined;
  polygon: GeoJSON;

  constructor(data: Data = {}) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.privateCode = data.privateCode;
    this.polygon = data.polygon
      ? new GeoJSON(data.polygon)
      : new GeoJSON({ type: GEOMETRY_TYPE.POLYGON });
  }

  addCoordinate(coordinate: number) {
    // The polygon must be closed: first coordinate == last coordinate.
    let coordinates = this.polygon.coordinates.slice();
    const lastCoordinate = coordinates.pop() || coordinate;
    coordinates.push(coordinate, lastCoordinate);

    return this.withChanges({
      polygon: this.polygon.withChanges({ coordinates })
    });
  }

  removeLastCoordinate() {
    let coordinates = this.polygon.coordinates.slice();
    if (coordinates.length > 2) {
      const lastCoordinate = coordinates.pop()!;
      coordinates.pop();
      coordinates.push(lastCoordinate);
    } else {
      coordinates = [];
    }

    return this.withChanges({
      polygon: this.polygon.withChanges({ coordinates })
    });
  }
}

export default FlexibleArea;
