import BookingArrangement from './BookingArrangement';
import Line, { initLine, lineToPayload } from './Line';

export enum FlexibleLineType {
  CORRIDOR_SERVICE = 'corridorService',
  MAIN_ROUTE_WITH_FLEXIBLE_ENDS = 'mainRouteWithFlexibleEnds',
  FLEXIBLE_AREAS_ONLY = 'flexibleAreasOnly',
  HAIL_AND_RIDE_SECTIONS = 'hailAndRideSections',
  FIXED_STOP_AREA_WIDE = 'fixedStopAreaWide',
  MIXED_FLEXIBLE = 'mixedFlexible',
  MIXED_FLEXIBLE_AND_FIXED = 'mixedFlexibleAndFixed',
  FIXED = 'fixed',
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
  return lineToPayload(line, true);
};

export default FlexibleLine;
