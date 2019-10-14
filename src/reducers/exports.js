import { REQUEST_EXPORTS, RECEIVE_EXPORTS, RECEIVE_EXPORT } from '../actions/exports';

const exportsReducer = (exports = null, action) => {
  switch (action.type) {
    case REQUEST_EXPORTS:
      return null;

    case RECEIVE_EXPORTS:
      return action.exports;

    case RECEIVE_EXPORT:
      return exports ? exports.map((e) => e.id === action.export.id ? action.export : e) : [action.export];

    default:
      return exports;
  }
};

export default exportsReducer;
