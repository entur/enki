import UserMenu from './UserMenu';
import { SelectProvider } from '../../SelectProvider/SelectProvider';
import { Contrast } from '@entur/layout';
import './styles.scss';
import Provider from '../../../../model/Provider';
import { useLocation } from 'react-router-dom';
import { SELECT_PROVIDER_PATH } from '../../Routes';

type UserPreferenceProps = {
  providers: Provider[] | undefined;
};

const UserPreference = ({ providers }: UserPreferenceProps) => {
  const location = useLocation();

  return (
    <div className="user-preference">
      <UserMenu />
      {providers &&
        providers.length > 0 &&
        location.pathname !== SELECT_PROVIDER_PATH && (
          <Contrast>
            <SelectProvider />
          </Contrast>
        )}
    </div>
  );
};

export default UserPreference;
