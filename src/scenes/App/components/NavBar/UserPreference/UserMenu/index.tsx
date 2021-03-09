import React from 'react';
import { useSelector } from 'react-redux';
import { UserIcon } from '@entur/icons';

import './styles.scss';
import { GlobalState } from 'reducers';
import { AuthState } from 'reducers/auth';

const UserMenu = () => {
  const { user } = useSelector<GlobalState, AuthState>((state) => state.auth);

  return (
    <div className="user-menu">
      <div className="user-icon">
        <UserIcon />
      </div>
      <div className="name">{`${user?.name}`}</div>
    </div>
  );
};

export default UserMenu;
