import BookingArrangement from './BookingArrangement';
import Line, { initLine, lineToPayload } from './Line';

interface FlexibleLine extends Line {
  flexibleLineType?: string;
  bookingArrangement?: BookingArrangement;
}

export const initFlexibleLine = initLine;

export const flexibleLineToPayload = (line: FlexibleLine) => {
  return lineToPayload(line);
};

export default FlexibleLine;
