import { SET_SAVED_CHANGES } from 'actions/constants';
import { EditorActionTypes } from 'actions/editor';
import { UnknownAction } from 'redux';

const initialState: EditorState = {
  isSaved: true,
};

export type EditorState = {
  isSaved: boolean;
};

function editor(
  state: EditorState = initialState,
  action: UnknownAction,
): EditorState {
  switch (action.type) {
    case SET_SAVED_CHANGES:
      const { payload } = action as EditorActionTypes;
      return { ...payload, isSaved: payload.isSaved };

    default:
      return state;
  }
}

export default editor;
