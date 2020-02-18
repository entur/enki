import { SET_SAVED_CHANGES, EditorActionTypes } from 'actions/editor';

const initialState = {
  isSaved: true
};

function editor(state = initialState, action: EditorActionTypes) {
  switch (action.type) {
    case SET_SAVED_CHANGES:
      const { payload } = action;
      return { ...payload, isSaved: payload.isSaved };

    default:
      return state;
  }
}

export default editor;
