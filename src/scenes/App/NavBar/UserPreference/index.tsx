import UserMenu from './UserMenu';
import { SelectProvider } from '../../SelectProvider/SelectProvider';
import { Contrast } from '@entur/layout';
import './styles.scss';
import { useNoSelectedProvider } from '../../useNoSelectedProvider';

const UserPreference = () => {
  const noSelectedProvider = useNoSelectedProvider();

  return (
    <div className="user-preference">
      <UserMenu />
      {!noSelectedProvider && (
        <Contrast>
          <SelectProvider />
        </Contrast>
      )}
    </div>
  );
};

export default UserPreference;
