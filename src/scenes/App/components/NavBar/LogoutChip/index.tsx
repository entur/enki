import React from 'react';
import { useSelector } from 'react-redux';
import { ActionChip } from '@entur/chip';
import { User } from 'reducers/user';
import { GlobalState } from 'reducers';
import './styles.scss';

const LogoutChip = () => {
  const { logoutUrl } = useSelector<GlobalState, User>(
    (state) => state.user as User
  );
  return (
    <a className="logout" href={logoutUrl}>
      <ActionChip>Logout</ActionChip>
    </a>
  );
};

export default LogoutChip;
