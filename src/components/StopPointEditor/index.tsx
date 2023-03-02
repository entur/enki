import { FlexibleLineType } from 'model/FlexibleLine';
import StopPoint from 'model/StopPoint';
import { ComponentClass, FunctionComponent, useMemo } from 'react';
import { FlexibleAreasOnlyStopPointEditor } from './FlexibleAreasOnlyStopPointEditor';
import { MixedFlexibleStopPointEditor } from './MixedFlexibleStopPointEditor';
import { GenericStopPointEditor } from './GenericStopPointEditor';

export type StopPointEditorProps = {
  order: number;
  stopPoint: StopPoint;
  spoilPristine: boolean;
  isFirst: boolean;
  isLast: boolean;
  onChange: (stopPoint: StopPoint) => void;
  onDelete: () => void;
  canDelete: boolean;
};

export type StopPointEditor =
  | FunctionComponent<StopPointEditorProps>
  | ComponentClass<StopPointEditorProps>;

export const getStopPointEditor = (
  flexibleLineType: FlexibleLineType | undefined
): StopPointEditor => {
  switch (flexibleLineType) {
    case FlexibleLineType.MIXED_FLEXIBLE:
      return MixedFlexibleStopPointEditor;
    case FlexibleLineType.FLEXIBLE_AREAS_ONLY:
      return FlexibleAreasOnlyStopPointEditor;
    default:
      return GenericStopPointEditor;
  }
};

export const useStopPointEditor = (
  flexibleLineType: FlexibleLineType | undefined
): StopPointEditor =>
  useMemo(() => getStopPointEditor(flexibleLineType), [flexibleLineType]);
