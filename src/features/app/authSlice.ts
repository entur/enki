import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth, User } from 'app/auth';
import type { RootState } from 'app/store';

export interface AuthState extends Auth<User> {
  loaded: boolean;
}

const initialState: AuthState = {
  loaded: false,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  roleAssignments: null,
  getAccessToken: () => Promise.resolve(''),
  logout: () => Promise.resolve(),
  login: () => Promise.resolve(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<Auth<User>>) => ({
      loaded: true,
      ...action.payload,
    }),
  },
});

export const { updateAuth } = authSlice.actions;

export const selectAuthLoaded = (state: RootState) => state.auth.loaded;

export default authSlice.reducer;
