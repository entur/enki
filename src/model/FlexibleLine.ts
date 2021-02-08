import BookingArrangement from './BookingArrangement';
import Line, { initLine, lineToPayload } from './Line';

interface FlexibleLine extends Line {
  flexibleLineType?: string;
  bookingArrangement?: BookingArrangement | null;
}

export const initFlexibleLine = () => {
  const line = {
    ...initLine(),
    flexibleLineType: 'flexibleAreasOnly',
  };
  return line;
};

export const flexibleLineToPayload = (line: FlexibleLine) => {
  return lineToPayload(line);
};

export default FlexibleLine;
