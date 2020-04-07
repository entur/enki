import {
  REQUEST_EXPORTS,
  RECEIVE_EXPORTS,
  RECEIVE_EXPORT,
} from 'actions/exports';
import { AnyAction } from 'redux';
import { Export } from 'model/Export';
import { SET_ACTIVE_PROVIDER } from 'actions/providers';

export type ExportsState = Export[] | null;

const exportsReducer = (exports: ExportsState = null, action: AnyAction) => {
  switch (action.type) {
    case REQUEST_EXPORTS:
      return null;

    case RECEIVE_EXPORTS:
      return action.exports;

    case RECEIVE_EXPORT:
      return exports
        ? exports.map((e) => (e.id === action.export.id ? action.export : e))
        : [action.export];

    case SET_ACTIVE_PROVIDER:
      return null;

    default:
      return exports;
  }
};

export default exportsReducer;
