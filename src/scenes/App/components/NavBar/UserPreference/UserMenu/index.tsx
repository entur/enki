import { UserIcon } from '@entur/icons';
import { useSelector } from 'react-redux';

import { AuthState } from 'features/app/authSlice';
import { GlobalState } from 'reducers';
import './styles.scss';

const UserMenu = () => {
  const { user } = useSelector<GlobalState, AuthState>((state) => state.auth);

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
