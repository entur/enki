import { SET_SAVED_CHANGES, EditorActionTypes } from 'actions/editor';

const initialState: EditorState = {
  isSaved: true,
};

export type EditorState = {
  isSaved: boolean;
};

function editor(
  state: EditorState = initialState,
  action: EditorActionTypes
): EditorState {
  switch (action.type) {
    case SET_SAVED_CHANGES:
      const { payload } = action;
      return { ...payload, isSaved: payload.isSaved };

    default:
      return state;
  }
}

export default editor;
