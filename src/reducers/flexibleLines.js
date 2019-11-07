import {
  RECEIVE_FLEXIBLE_LINES,
  RECEIVE_FLEXIBLE_LINE
} from '../actions/flexibleLines';

const flexibleLines = (lines = null, action) => {
  switch (action.type) {
    case RECEIVE_FLEXIBLE_LINES:
      return action.lines;

    case RECEIVE_FLEXIBLE_LINE:
      return lines
        ? lines.map(l => (l.id === action.line.id ? action.line : l))
        : [action.line];

    default:
      return lines;
  }
};

export default flexibleLines;
