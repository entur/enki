import BookingArrangement from './BookingArrangement';
import Line, { initLine, lineToPayload } from './Line';

type FlexibleLine = Line & {
  flexibleLineType?: string;
  bookingArrangement?: BookingArrangement;
};

export const initFlexibleLine = initLine;

export const flexibleLineToPayload = lineToPayload;

export default FlexibleLine;
