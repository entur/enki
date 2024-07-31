import { SandboxFeatureProps } from '../SandboxFeature';
import { SandboxFeatures } from '../../config/config';
import StopPoint from '../../model/StopPoint';

export interface JourneyPatternStopPointMapProps
  extends SandboxFeatureProps<SandboxFeatures> {
  transportMode: string;
  pointsInSequence: StopPoint[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef: string) => void;
}
