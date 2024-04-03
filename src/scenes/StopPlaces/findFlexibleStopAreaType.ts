import { KeyValues } from 'model/KeyValues';
import { FLEXIBLE_STOP_AREA_TYPE } from 'model/enums';

export const findFlexibleStopAreaType = (
  keyValues?: KeyValues[],
): FLEXIBLE_STOP_AREA_TYPE | undefined =>
  keyValues?.find((v) => v.key === 'FlexibleStopAreaType')?.values[0] as
    | FLEXIBLE_STOP_AREA_TYPE
    | undefined;
