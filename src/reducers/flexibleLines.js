import {
  RECEIVE_FLEXIBLE_LINES,
  REQUEST_FLEXIBLE_LINES
} from '../actions/flexibleLines';

const flexibleLines = (lines = null, action) => {
  switch (action.type) {
    case REQUEST_FLEXIBLE_LINES:
      return null;

    case RECEIVE_FLEXIBLE_LINES:
      return action.lines;

    default:
      return lines;
  }
};

export default flexibleLines;
