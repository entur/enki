import { Coordinate } from 'model/GeoJSON';

export const transformTextToCoordinates = (text: string): Coordinate[] =>
  JSON.parse(text);
