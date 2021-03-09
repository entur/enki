import React from 'react';
import { useSelector } from 'react-redux';
import { ActionChip } from '@entur/chip';
import { AuthState } from 'reducers/auth';
import { GlobalState } from 'reducers';
import { AppIntlState, selectIntl } from 'i18n';
import { BackArrowIcon } from '@entur/icons';
import './styles.scss';

const LogoutChip = () => {
  const {
    auth: { logout },
    intl: { formatMessage },
  } = useSelector<GlobalState, { auth: AuthState; intl: AppIntlState }>(
    (state) => ({
      auth: state.auth,
      intl: selectIntl(state),
    })
  );
  return (
    <ActionChip onClick={() => logout()} className="logout">
      <BackArrowIcon />
      {formatMessage('userMenuLogoutLinkText')}
    </ActionChip>
  );
};

export default LogoutChip;
