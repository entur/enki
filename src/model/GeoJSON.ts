export type Coordinate = [number, number];

type GeoJSON = {
  type?: string;
  coordinates?: Coordinate[];
};

export const addCoordinate = (
  coordinates: Coordinate[],
  coordinate: Coordinate,
) => {
  // The polygon must be closed: first coordinate == last coordinate.
  const lastCoordinate = coordinates[coordinates.length - 1] ?? coordinate;
  return [...coordinates.slice(0, -1), coordinate, lastCoordinate];
};

export const removeLastCoordinate = (
  coordinates: Coordinate[],
): Coordinate[] => {
  if (coordinates.length > 2) {
    const lastCoordinate: Coordinate = coordinates[coordinates.length - 1];
    return [...coordinates.slice(0, -2), lastCoordinate];
  } else {
    return [];
  }
};

const coordinateListRegEx =
  /^\[(\[\d+(\.\d*)?,\d+(\.\d*)?\])?(,\[\d+(\.\d*)?,\d+(\.\d*)?\])*\]$/;

export const stringIsValidCoordinates = (s: string) => {
  const strippedString = s.replace(/\s/g, '');
  return coordinateListRegEx.test(strippedString);
};

export default GeoJSON;
