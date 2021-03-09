/* Initial state is initialized in ../store.js */

import { AnyAction } from 'redux';

interface Auth {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  roleAssignments: string[] | null;
  getAccessToken: () => Promise<string>;
  logout: () => void;
}

interface User {
  name: string;
}

export type AuthState = Auth;

const defaultState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  roleAssignments: null,
  getAccessToken: () => Promise.resolve(''),
  logout: () => {},
};

const authReducer = (
  state: AuthState = defaultState,
  action: AnyAction
): AuthState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default authReducer;
