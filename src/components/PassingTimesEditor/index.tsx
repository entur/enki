import { FlexibleLineType } from 'model/FlexibleLine';
import PassingTime from 'model/PassingTime';
import StopPoint from 'model/StopPoint';
import { ComponentClass, FunctionComponent, useMemo } from 'react';
import { FlexibleAreasOnlyPassingTimesEditor } from './FlexibleAreasOnlyPassingTimesEditor/FlexibleAreasOnlyPassingTimesEditor';
import { TimeWindowPassingTimesEditor } from './GenericPassingTimesEditor/GenericPassingTimesEditor';
import { MixedFlexiblePassingTimesEditor } from './MixedFlexiblePassingTimesEditor/MixedFlexiblePassingTimesEditor';
import './styles.scss';

export type PassingTimesEditorProps = {
  passingTimes: PassingTime[];
  stopPoints: StopPoint[];
  onChange: (pts: PassingTime[]) => void;
  spoilPristine: boolean;
  flexibleLineType?: FlexibleLineType;
};

export type PassingTimesEditor =
  | FunctionComponent<PassingTimesEditorProps>
  | ComponentClass<PassingTimesEditorProps>;

export const getPassingTimesEditor = (
  flexibleLineType: FlexibleLineType | undefined
): PassingTimesEditor => {
  switch (flexibleLineType) {
    case FlexibleLineType.MIXED_FLEXIBLE:
      return MixedFlexiblePassingTimesEditor;
    case FlexibleLineType.FLEXIBLE_AREAS_ONLY:
      return FlexibleAreasOnlyPassingTimesEditor;
    default:
      return TimeWindowPassingTimesEditor;
  }
};

export const usePassingTimesEditor = (
  flexibleLineType: FlexibleLineType | undefined
): PassingTimesEditor =>
  useMemo(() => getPassingTimesEditor(flexibleLineType), [flexibleLineType]);
