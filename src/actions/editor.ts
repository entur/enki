import { EditorState } from 'reducers/editor';
import { SET_SAVED_CHANGES } from './constants';

type SetSavedChanges = {
  type: typeof SET_SAVED_CHANGES;
  payload: EditorState;
};

export function setSavedChanges(isSaved: boolean): SetSavedChanges {
  return {
    type: SET_SAVED_CHANGES,
    payload: { isSaved },
  };
}

export type EditorActionTypes = SetSavedChanges;
