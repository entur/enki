import {
  RECEIVE_FLEXIBLE_LINE,
  RECEIVE_FLEXIBLE_LINES,
} from 'actions/constants';
import { ReceiveFlexibleLineAction } from 'actions/flexibleLines';
import JourneyPattern from 'model/JourneyPattern';
import { AnyAction } from 'redux';
import FlexibleLine from '../model/FlexibleLine';
import { createUuid } from '../helpers/generators';

export type FlexibleLinesState = FlexibleLine[] | null;

const flexibleLines = (
  lines: FlexibleLinesState = null,
  action: AnyAction,
): FlexibleLinesState => {
  switch (action.type) {
    case RECEIVE_FLEXIBLE_LINES:
      return action.lines;

    case RECEIVE_FLEXIBLE_LINE:
      const newJourneyPatterns: JourneyPattern[] =
        (action as ReceiveFlexibleLineAction).line?.journeyPatterns?.map(
          (jp) => ({
            ...jp,
            pointsInSequence: jp.pointsInSequence.map((pis) => ({
              ...pis,
              key: createUuid(),
              flexibleStopPlaceRef: pis.flexibleStopPlace?.id,
            })),
          }),
        ) ?? [];

      const newFlexibleLine: FlexibleLine = {
        ...action.line,
        networkRef: action.line.network?.id,
        journeyPatterns: newJourneyPatterns,
      };

      return (
        lines?.map((l) => (l.id === action.line.id ? newFlexibleLine : l)) ?? [
          newFlexibleLine,
        ]
      );

    default:
      return lines;
  }
};

export default flexibleLines;
