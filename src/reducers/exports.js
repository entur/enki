import { REQUEST_EXPORTS, RECEIVE_EXPORTS } from '../actions/exports';

const exportsReducer = (exports = null, action) => {
  switch (action.type) {
    case REQUEST_EXPORTS:
      return null;

    case RECEIVE_EXPORTS:
      return action.exports;

    default:
      return exports;
  }
};

export default exportsReducer;
