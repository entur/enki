import { SET_UNSAVEDCHANGES, EditorActionTypes } from 'actions/editor';

const initialState = {
  isUnsaved: false
};

function editor(state = initialState, action: EditorActionTypes) {
  switch (action.type) {
    case SET_UNSAVEDCHANGES:
      const { payload } = action;
      return { ...payload, isUnsaved: payload.isUnsaved };

    default:
      return state;
  }
}

export default editor;
