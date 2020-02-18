import { SET_SAVED_CHANGES, EditorActionTypes } from 'actions/editor';

const initialState = {
  isSaved: true
};

type EditorType = {
  isSaved: boolean;
};

function editor(
  state: EditorType = initialState,
  action: EditorActionTypes
): EditorType {
  switch (action.type) {
    case SET_SAVED_CHANGES:
      const { payload } = action;
      return { ...payload, isSaved: payload.isSaved };

    default:
      return state;
  }
}

export default editor;
