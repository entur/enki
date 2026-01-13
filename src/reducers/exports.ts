import {
  RECEIVE_EXPORT,
  RECEIVE_EXPORTS,
  REQUEST_EXPORTS,
} from 'actions/constants';
import { ReceiveExportAction, ReceiveExportsAction } from 'actions/exports';
import { Export } from 'model/Export';
import { UnknownAction } from 'redux';

export type ExportsState = Export[] | null;

const exportsReducer = (
  exports: ExportsState = null,
  action: UnknownAction,
) => {
  switch (action.type) {
    case REQUEST_EXPORTS:
      return null;

    case RECEIVE_EXPORTS:
      return (action as ReceiveExportsAction).exports.sort(
        (a: Export, b: Export) => {
          const aDate = new Date(a.created!);
          const bDate = new Date(b.created!);
          return bDate.getTime() - aDate.getTime();
        },
      );

    case RECEIVE_EXPORT: {
      const typedAction = action as ReceiveExportAction;
      return exports
        ? exports.map((e) =>
            e.id === typedAction.export.id ? typedAction.export : e,
          )
        : [typedAction.export];
    }

    default:
      return exports;
  }
};

export default exportsReducer;
