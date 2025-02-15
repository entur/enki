import StopPoint from '../../model/StopPoint';
import { VEHICLE_MODE } from '../../model/enums';
import { Centroid, Location, Quay, StopPlace } from '../../api';

export interface MapWrapperProps {
  transportMode: VEHICLE_MODE;
  pointsInSequence: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  focusedQuayId: string | undefined | null;
  onFocusedQuayIdUpdate: (quayId: string | undefined | null) => void;
}

export interface JourneyPatternStopPointMapProps {
  stopPlacesState: JourneyPatternsStopPlacesState;
  transportMode: VEHICLE_MODE;
  pointsInSequence: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  focusedQuayId: string | undefined | null;
  onFocusedQuayIdUpdate: (quayId: string | undefined | null) => void;
}

export interface JourneyPatternsStopPlacesState {
  stopPlaces: StopPlace[];
  quayLocationsIndex: Record<string, Centroid>;
  quayStopPlaceIndex: Record<string, string>;
}

export interface JourneyPatternsMapState {
  quayStopPointSequenceIndexes: Record<string, number[]>;
  stopPointLocationSequence: StopPointLocation[];
  showQuaysState: Record<string, boolean>;
  hideNonSelectedQuaysState: Record<string, boolean>;
  focusedMarker: FocusedMarker | undefined;
}

/**
 * Determines whether to "focus" a stop place or a quay
 */
export enum JourneyPatternMarkerType {
  QUAY = 'quay',
  STOP_PLACE = 'stop_place',
}

export interface JourneyPatternMarker {
  id: string;
  location: Location;
  type: JourneyPatternMarkerType;
}

/**
 * E.g. when user clicks on "locate" button in the search input results,
 * a certain marker gets into a "focused" state - meaning e.g. its popup opens up
 */
export interface FocusedMarker {
  stopPlaceId: string;
  quays?: Quay[];
  marker: JourneyPatternMarker;
}

export interface FocusedMarkerNewMapState {
  showQuaysState?: Record<string, boolean>;
  hideNonSelectedQuaysState?: Record<string, boolean>;
  focusedMarker: FocusedMarker | undefined;
}

export type StopPointLocation = [number, number];

export interface MapSpecs {
  zoom: number;
  bounds: [number, number, number, number];
}

export interface ServiceLink {
  serviceLinkRef: string;
  quayRefFrom: string;
  quayRefTo: string;
  routeGeometry: RouteGeometry;
}

export interface RouteGeometry {
  distance: number;
  coordinates: number[][];
}
