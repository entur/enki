import { SandboxFeatureProps } from '../SandboxFeature';
import { SandboxFeatures } from '../../config/config';
import StopPoint from '../../model/StopPoint';
import { VEHICLE_MODE } from '../../model/enums';
import { StopPlace } from '../../api';
import { StopPointLocation } from '../../reducers/stopPlaces';

export interface JourneyPatternStopPointMapProps
  extends SandboxFeatureProps<SandboxFeatures> {
  transportMode: VEHICLE_MODE;
  pointsInSequence: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
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
  type: JourneyPatternMarkerType;
}

/**
 * E.g. when user clicks on "locate" button in the search input results,
 * a certain marker gets into a "focused" state - meaning e.g. its popup opens up
 */
export interface FocusedMarker {
  stopPlace: StopPlace;
  marker: JourneyPatternMarker;
}

export interface FocusedMarkerNewMapState {
  showQuaysState?: Record<string, boolean>;
  hideNonSelectedQuaysState?: Record<string, boolean>;
  focusedMarker: FocusedMarker | undefined;
}
