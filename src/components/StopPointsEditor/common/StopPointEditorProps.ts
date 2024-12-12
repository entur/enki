import { FlexibleLineType } from 'model/FlexibleLine';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';

export interface StopPointEditorProps {
  order?: number;
  stopPoint: StopPoint;
  spoilPristine: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onChange: (stopPoint: StopPoint) => void;
  onDelete?: () => void;
  canDelete?: boolean;
  flexibleStopPlaces?: FlexibleStopPlace[];
  flexibleLineType?: FlexibleLineType;
  onFocusedQuayIdUpdate?: (quayId: string | undefined | null) => void;
  swapStopPoints?: (position1: number, position2: number) => void;
}

export interface GenericStopPointEditorProps extends StopPointEditorProps {
  order: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface MixedFlexibleStopPointEditorProps
  extends StopPointEditorProps {
  order: number;
  isFirst: boolean;
  isLast: boolean;
}
