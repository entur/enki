import { FlexibleLineType } from 'model/FlexibleLine';
import StopPoint from 'model/StopPoint';
import { ComponentClass, FunctionComponent, useMemo } from 'react';
import { FlexibleAreasOnlyStopPointsEditor } from './FlexibleAreasOnly/FlexibleAreasOnlyStopPointsEditor';
import { GenericStopPointsEditor } from './Generic/GenericStopPointsEditor';
import { MixedFlexibleStopPointsEditor } from './MixedFlexible/MixedFlexibleStopPointsEditor';
import './styles.scss';
import { VEHICLE_MODE } from '../../model/enums';

export type StopPointsEditorProps = {
  flexibleLineType?: FlexibleLineType;
  pointsInSequence: StopPoint[];
  spoilPristine: boolean;
  updateStopPoint: (index: number, stopPoint: StopPoint) => void;
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  onPointsInSequenceChange: (pointsInSequence: StopPoint[]) => void;
  transportMode?: VEHICLE_MODE;
  initDefaultJourneyPattern: () => void;
};

export type StopPointsEditor =
  | FunctionComponent<StopPointsEditorProps>
  | ComponentClass<StopPointsEditorProps>;

export const getStopPointsEditor = (
  flexibleLineType: FlexibleLineType | undefined,
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
  flexibleLineType: FlexibleLineType | undefined,
): StopPointsEditor =>
  useMemo(() => getStopPointsEditor(flexibleLineType), [flexibleLineType]);
