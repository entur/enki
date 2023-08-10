import { Coordinate } from 'model/GeoJSON';

export const coordinatesToText = (polygonCoordinates: Coordinate[]): string =>
  JSON.stringify(polygonCoordinates);
