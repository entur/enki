import { TileLayer } from '../../config/config';

export const OPEN_STREET_MAP = 'OpenStreetMap';
export const DEFAULT_ZOOM_LEVEL = 14;
export const DEFAULT_CENTER: [number, number] = [59.91, 10.76];
export const DEFAULT_OSM_TILE: TileLayer = {
  name: OPEN_STREET_MAP,
  url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
};
