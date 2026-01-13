import {
  RECEIVE_FLEXIBLE_LINE,
  RECEIVE_FLEXIBLE_LINES,
} from 'actions/constants';
import {
  ReceiveFlexibleLineAction,
  ReceiveFlexibleLinesAction,
} from 'actions/flexibleLines';
import JourneyPattern from 'model/JourneyPattern';
import { UnknownAction } from 'redux';
import FlexibleLine from '../model/FlexibleLine';
import { createUuid } from '../helpers/generators';

export type FlexibleLinesState = FlexibleLine[] | null;

const flexibleLines = (
  lines: FlexibleLinesState = null,
  action: UnknownAction,
): FlexibleLinesState => {
  switch (action.type) {
    case RECEIVE_FLEXIBLE_LINES:
      return (action as ReceiveFlexibleLinesAction).lines;

    case RECEIVE_FLEXIBLE_LINE: {
      const typedAction = action as ReceiveFlexibleLineAction;
      const newJourneyPatterns: JourneyPattern[] =
        typedAction.line?.journeyPatterns?.map((jp) => ({
          ...jp,
          pointsInSequence: jp.pointsInSequence.map((pis) => ({
            ...pis,
            key: createUuid(),
            flexibleStopPlaceRef: pis.flexibleStopPlace?.id,
          })),
        })) ?? [];

      const newFlexibleLine: FlexibleLine = {
        ...typedAction.line,
        networkRef: typedAction.line.network?.id,
        brandingRef: typedAction.line.branding?.id,
        journeyPatterns: newJourneyPatterns,
      };

      return (
        lines?.map((l) =>
          l.id === typedAction.line.id ? newFlexibleLine : l,
        ) ?? [newFlexibleLine]
      );
    }

    default:
      return lines;
  }
};

export default flexibleLines;
