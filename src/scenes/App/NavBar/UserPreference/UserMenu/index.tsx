import { UserIcon } from '@entur/icons';
import './styles.scss';
import { useAppSelector } from '../../../../../store/hooks';

const UserMenu = () => {
  const preferredName = useAppSelector(
    (state) => state.userContext.preferredName,
  );

  return (
    <div className="user-menu">
      <div className="user-icon">
        <UserIcon />
      </div>
      <div className="name">{`${preferredName || 'Unknown'}`}</div>
    </div>
  );
};

export default UserMenu;
