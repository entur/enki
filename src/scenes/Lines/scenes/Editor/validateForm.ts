import FlexibleLine from 'model/FlexibleLine';
import { isBlank } from 'helpers/forms';

export const aboutLineStepIsValid = (flexibleLine: FlexibleLine): boolean =>
  !isBlank(flexibleLine.name) &&
  !isBlank(flexibleLine.publicCode) &&
  !isBlank(flexibleLine.operatorRef) &&
  !isBlank(flexibleLine.flexibleLineType) &&
  !isBlank(flexibleLine.networkRef);
