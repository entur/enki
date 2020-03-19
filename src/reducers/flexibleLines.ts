import {
  RECEIVE_FLEXIBLE_LINES,
  RECEIVE_FLEXIBLE_LINE
} from 'actions/flexibleLines';
import FlexibleLine from '../model/FlexibleLine';
import { AnyAction } from 'redux';

export type FlexibleLinesState = FlexibleLine[] | null;

const flexibleLines = (
  lines: FlexibleLinesState = null,
  action: AnyAction
): FlexibleLinesState => {
  switch (action.type) {
    case RECEIVE_FLEXIBLE_LINES:
      return action.lines;

    case RECEIVE_FLEXIBLE_LINE:
      return lines
        ? lines.map(l =>
            l.id === action.line.id
              ? { ...action.line, networkRef: action.line.network?.id }
              : l
          )
        : [{ ...action.line, networkRef: action.line.network?.id }];

    default:
      return lines;
  }
};

export default flexibleLines;
