import {
  RECEIVE_FLEXIBLE_LINES,
  RECEIVE_FLEXIBLE_LINE,
  FlexibleLinesAction,
} from 'actions/flexibleLines';
import FlexibleLine from '../model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';
import { SET_ACTIVE_PROVIDER } from 'actions/providers';

export type FlexibleLinesState = FlexibleLine[] | null;

const flexibleLines = (
  lines: FlexibleLinesState = null,
  action: FlexibleLinesAction
): FlexibleLinesState => {
  switch (action.type) {
    case RECEIVE_FLEXIBLE_LINES:
      return action.lines;

    case RECEIVE_FLEXIBLE_LINE:
      const newJourneyPatterns: JourneyPattern[] =
        action.line?.journeyPatterns?.map((jp) => ({
          ...jp,
          pointsInSequence: jp.pointsInSequence.map((pis) => ({
            ...pis,
            flexibleStopPlaceRef: pis.flexibleStopPlace?.id,
          })),
        })) ?? [];

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

    case SET_ACTIVE_PROVIDER:
      return null;

    default:
      return lines;
  }
};

export default flexibleLines;
