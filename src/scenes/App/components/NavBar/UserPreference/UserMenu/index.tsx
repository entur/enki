import React from 'react';
import { useSelector } from 'react-redux';
import { UserIcon } from '@entur/icons';

import './styles.scss';
import { GlobalState } from 'reducers';
import { User } from 'reducers/user';

const UserMenu = () => {
  const { familyName, givenName } = useSelector<GlobalState, User>(
    (state) => state.user as User
  );

  return (
    <div className="user-menu">
      <div className="user-icon">
        <UserIcon color="#ffffff" />
      </div>
      <div className="name">{`${givenName} ${familyName}`}</div>
    </div>
  );
};

export default UserMenu;
