import { SandboxFeatureProps } from '../../config/SandboxFeature';
import { LatLngExpression, LatLngTuple } from 'leaflet';

export interface TestProps extends SandboxFeatureProps {
  feature: 'test';
  quayRef?: string | null;
  onClick: (position?: LatLngExpression) => void;
}
