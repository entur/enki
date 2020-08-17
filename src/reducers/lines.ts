import Line from 'model/Line';
import { LinesAction, RECEIVE_LINES } from 'actions/lines';

export type LinesState = Line[] | null;

const lines = (lines: LinesState = null, action: LinesAction): LinesState => {
  switch (action.type) {
    case RECEIVE_LINES:
      return action.lines;

    default:
      return lines;
  }
};

export default lines;
