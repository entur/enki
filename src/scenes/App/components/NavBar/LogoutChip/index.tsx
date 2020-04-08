import React from 'react';
import { useSelector } from 'react-redux';
import { ActionChip } from '@entur/chip';
import { User } from 'reducers/user';
import { GlobalState } from 'reducers';
import { AppIntlState, selectIntl } from 'i18n';
import './styles.scss';

const LogoutChip = () => {
  const {
    user: { logoutUrl },
    intl: { formatMessage },
  } = useSelector<GlobalState, { user: User; intl: AppIntlState }>((state) => ({
    user: state.user as User,
    intl: selectIntl(state),
  }));
  return (
    <a className="logout" href={logoutUrl}>
      <ActionChip> {formatMessage('userMenuLogoutLinkText')} </ActionChip>
    </a>
  );
};

export default LogoutChip;
