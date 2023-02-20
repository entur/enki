import BookingArrangement from './BookingArrangement';
import Line, { initLine, lineToPayload } from './Line';

export enum FlexibleLineType {
  FIXED = 'fixed',
  FLEXIBLE_AREAS_ONLY = 'flexibleAreasOnly',
  MIXED_FLEXIBLE = 'mixedFlexible',
}

interface FlexibleLine extends Line {
  flexibleLineType?: FlexibleLineType;
  bookingArrangement?: BookingArrangement | null;
}

export const initFlexibleLine = () => {
  const line = {
    ...initLine(),
    flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
  };
  return line;
};

export const flexibleLineToPayload = (line: FlexibleLine) => {
  return lineToPayload(line);
};

export default FlexibleLine;
