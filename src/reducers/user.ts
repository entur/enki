/* Initial state is initialized in ../store.js */

import { AnyAction } from 'redux';

type UserStateShield = UserState | {};

export type UserState = {
  logoutUrl: string;
  familyName?: string;
  givenName: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

const userReducer = (
  state: UserStateShield = {},
  action: AnyAction
): UserStateShield => {
  switch (action.type) {
    default:
      return state;
  }
};

export default userReducer;
