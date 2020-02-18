export const SET_SAVED_CHANGES = 'SET_SAVED_CHANGES';

type SetSavedChanges = {
  type: typeof SET_SAVED_CHANGES;
  payload: { isSaved: boolean };
};

export function setSavedChanges(isSaved: boolean): SetSavedChanges {
  return {
    type: SET_SAVED_CHANGES,
    payload: { isSaved }
  };
}

export type EditorActionTypes = SetSavedChanges;
