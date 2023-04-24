import { ActionChip } from '@entur/chip';
import { BackArrowIcon } from '@entur/icons';
import { AuthState } from 'features/app/authSlice';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import './styles.scss';

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
