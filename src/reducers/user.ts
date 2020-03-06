/* Initial state is initialized in ../store.js */

import { AnyAction } from 'redux';

export type UserState = User | {};

export type User = {
  logoutUrl: string;
  familyName?: string;
  givenName: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

const userReducer = (state: UserState = {}, action: AnyAction): UserState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default userReducer;
