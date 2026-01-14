import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  isSaved: boolean;
}

const initialState: EditorState = {
  isSaved: true,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setSavedChanges: (state, action: PayloadAction<boolean>) => {
      state.isSaved = action.payload;
    },
  },
});

export const { setSavedChanges } = editorSlice.actions;
export default editorSlice.reducer;
