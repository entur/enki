import { FlexibleLineType } from 'model/FlexibleLine';
import StopPoint from 'model/StopPoint';
import { ComponentClass, FunctionComponent, useMemo } from 'react';
import { FlexibleAreasOnlyStopPointsEditor } from './FlexibleAreasOnly/FlexibleAreasOnlyStopPointsEditor';
import { GenericStopPointsEditor } from './Generic/GenericStopPointsEditor';
import { MixedFlexibleStopPointsEditor } from './MixedFlexible/MixedFlexibleStopPointsEditor';
import './styles.scss';

export type StopPointsEditorProps = {
  flexibleLineType?: FlexibleLineType | undefined;
  pointsInSequence: StopPoint[];
  spoilPristine: boolean;
  updateStopPoint: (index: number, stopPoint: StopPoint) => void;
  deleteStopPoint: (index: number) => void;
  addStopPoint: () => void;
  onPointsInSequenceChange: (pointsInSequence: StopPoint[]) => void;
};

export type StopPointsEditor =
  | FunctionComponent<StopPointsEditorProps>
  | ComponentClass<StopPointsEditorProps>;

export const getStopPointsEditor = (
  flexibleLineType: FlexibleLineType | undefined
): StopPointsEditor => {
  switch (flexibleLineType) {
    case FlexibleLineType.MIXED_FLEXIBLE:
      return MixedFlexibleStopPointsEditor;
    case FlexibleLineType.FLEXIBLE_AREAS_ONLY:
      return FlexibleAreasOnlyStopPointsEditor;
    default:
      return GenericStopPointsEditor;
  }
};

export const useStopPointsEditor = (
  flexibleLineType: FlexibleLineType | undefined
): StopPointsEditor =>
  useMemo(() => getStopPointsEditor(flexibleLineType), [flexibleLineType]);
