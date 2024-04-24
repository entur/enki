import { ActionChip } from '@entur/chip';
import { BackArrowIcon } from '@entur/icons';
import { useIntl } from 'react-intl';
import { useAuth } from '../../../../../auth/auth';
import './styles.scss';

const LogoutChip = () => {
  const auth = useAuth();
  const { formatMessage } = useIntl();

  return (
    <ActionChip
      onClick={() => auth.logout({ returnTo: window.location.origin })}
      className="logout"
    >
      <BackArrowIcon />
      {formatMessage({ id: 'userMenuLogoutLinkText' })}
    </ActionChip>
  );
};

export default LogoutChip;
