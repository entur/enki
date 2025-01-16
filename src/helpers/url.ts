import FlexibleLine from 'model/FlexibleLine';
import { Params } from 'react-router-dom';

export const getFlexibleLineFromPath = (
  flexibleLines: FlexibleLine[],
  params: Params,
): FlexibleLine | undefined =>
  flexibleLines.find((flexibleLine) => flexibleLine.id === params.id);
