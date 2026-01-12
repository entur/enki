import { FlexibleLineType } from '../../../model/FlexibleLine';
import StopPoint from '../../../model/StopPoint';

export interface StopPointButtonGroupProps {
  flexibleLineType: FlexibleLineType | undefined;
  canDelete: boolean | undefined;
  stopPoint: StopPoint;
  onFocusedQuayIdUpdate?:
    | ((quayId: string | undefined | null) => void)
    | undefined;
  onDeleteDialogOpen: (isOpen: boolean) => void;
}
