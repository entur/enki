import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';

interface Auth {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  roleAssignments: string[] | null;
  getAccessToken: () => Promise<string>;
  logout: (options: any) => void;
}

interface User {
  name: string;
}

export interface AuthState extends Auth {
  loaded: boolean;
}

const initialState: AuthState = {
  loaded: false,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  roleAssignments: null,
  getAccessToken: () => Promise.resolve(''),
  logout: () => {},
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
