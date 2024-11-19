import { FlexibleLineType } from 'model/FlexibleLine';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';

export type StopPointEditorProps = {
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
};
