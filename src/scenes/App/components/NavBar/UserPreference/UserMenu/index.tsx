import { UserIcon } from '@entur/icons';
import { useAuth } from '../../../../../../auth/auth';
import './styles.scss';

const UserMenu = () => {
  const { user } = useAuth();

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
