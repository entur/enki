import { CREATE_FLEXIBLE_LINE } from '../actions/flexibleLines';

const flexibleLines = (lines = [], action) => {
  switch (action.type) {
    case CREATE_FLEXIBLE_LINE:
      return lines.concat(action.fl);

    default:
      return lines;
  }
};

export default flexibleLines;
