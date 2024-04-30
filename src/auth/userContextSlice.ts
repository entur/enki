import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserContext {
  preferredName?: string;
  isAdmin: boolean;
}

const initialState: UserContext = {
  isAdmin: false,
};

export const userContextSlice = createSlice({
  name: 'userContext',
  initialState,
  reducers: {
    updateUserContext: (
      state,
      action: PayloadAction<Omit<UserContext, 'activeProvider'>>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { updateUserContext } = userContextSlice.actions;

export default userContextSlice.reducer;
