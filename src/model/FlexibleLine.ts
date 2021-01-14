import BookingArrangement from './BookingArrangement';
import Line, { initLine, lineToPayload } from './Line';

interface FlexibleLine extends Line {
  flexibleLineType?: string;
  bookingArrangement?: BookingArrangement;
}

export const initFlexibleLine = initLine;

export const flexibleLineToPayload = (line: Line) => {
  const payload: any = lineToPayload(line);

  if (payload.bookingArrangement === undefined) {
    payload.bookingArrangement = null;
  }

  return payload;
};

export default FlexibleLine;
