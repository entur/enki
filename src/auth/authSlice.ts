import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from 'auth/auth';
import type { RootState } from 'store/store';

export interface AuthState extends Auth {
  loaded: boolean;
}

const initialState: AuthState = {
  loaded: false,
  isLoading: false,
  isAuthenticated: false,
  user: undefined,
  roleAssignments: null,
  getAccessToken: () => Promise.resolve(''),
  logout: () => Promise.resolve(),
  login: () => Promise.resolve(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<Auth>) => ({
      loaded: true,
      ...action.payload,
    }),
  },
});

export const { updateAuth } = authSlice.actions;

export const selectAuthLoaded = (state: RootState) => state.auth.loaded;

export default authSlice.reducer;
