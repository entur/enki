import { SandboxFeatureProps } from '../SandboxFeature';
import { SandboxFeatures } from '../../config/config';
import StopPoint from '../../model/StopPoint';
import { VEHICLE_MODE } from '../../model/enums';

export interface JourneyPatternStopPointMapProps
  extends SandboxFeatureProps<SandboxFeatures> {
  transportMode: VEHICLE_MODE;
  pointsInSequence: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
}
