export const SET_UNSAVEDCHANGES = 'SET_UNSAVEDCHANGES';

type SetUnsavedChanges = {
  type: typeof SET_UNSAVEDCHANGES;
  payload: { isUnsaved: boolean };
};

export function setUnsavedChanges(isUnsaved: boolean): SetUnsavedChanges {
  return {
    type: SET_UNSAVEDCHANGES,
    payload: { isUnsaved }
  };
}

export type EditorActionTypes = SetUnsavedChanges;
