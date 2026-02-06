import Chip from '@mui/material/Chip';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useIntl } from 'react-intl';
import { useAuth } from '../../../../auth/auth';
import './styles.scss';

const LogoutChip = () => {
  const auth = useAuth();
  const { formatMessage } = useIntl();

  return (
    <Chip
      onClick={() => auth.logout({ returnTo: window.location.origin })}
      className="logout"
      icon={<ArrowBack />}
      label={formatMessage({ id: 'userMenuLogoutLinkText' })}
      clickable
    />
  );
};

export default LogoutChip;
