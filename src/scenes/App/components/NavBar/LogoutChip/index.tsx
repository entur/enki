import React from 'react';
import { useSelector } from 'react-redux';
import { ActionChip } from '@entur/chip';
import { GlobalState } from 'reducers';
import { useIntl } from 'react-intl';
import { BackArrowIcon } from '@entur/icons';
import './styles.scss';
import { AuthState } from 'features/app/authSlice';

const LogoutChip = () => {
  const {
    auth: { logout },
  } = useSelector<GlobalState, { auth: AuthState }>((state) => ({
    auth: state.auth,
  }));

  const { formatMessage } = useIntl();

  return (
    <ActionChip
      onClick={() => logout({ returnTo: window.location.origin })}
      className="logout"
    >
      <BackArrowIcon />
      {formatMessage({ id: 'userMenuLogoutLinkText' })}
    </ActionChip>
  );
};

export default LogoutChip;
