import { RECEIVE_LINES, REQUEST_LINES } from '../actions/flexibleLines';

const flexibleLines = (lines = null, action) => {
  switch (action.type) {
    case REQUEST_LINES:
      return null;

    case RECEIVE_LINES:
      return action.lines;

    default:
      return lines;
  }
};

export default flexibleLines;
