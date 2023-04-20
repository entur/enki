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
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateAuth: (state, action: PayloadAction<Auth>) => ({
      loaded: true,
      ...action.payload,
    }),
  },
});

export const { updateAuth } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value
export const selectAuthLoaded = (state: RootState) => state.auth.loaded;

export default authSlice.reducer;
