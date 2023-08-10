import { Coordinate } from 'model/GeoJSON';

// Map expects coordinates in lat-lon order, whereas geojson has lon-lat
export const transformToMapCoordinates = (
  geojson: Coordinate[]
): Coordinate[] =>
  geojson.length === 0 ? geojson : geojson.map(([y, x]) => [x, y]);
