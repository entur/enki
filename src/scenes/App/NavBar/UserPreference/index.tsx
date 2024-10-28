import UserMenu from './UserMenu';
import { SelectProvider } from '../../SelectProvider/SelectProvider';
import { Contrast } from '@entur/layout';
import './styles.scss';
import { useNoSelectedProvider } from '../../useNoSelectedProvider';
import Provider from '../../../../model/Provider';

type UserPreferenceProps = {
  providers: Provider[] | undefined;
};

const UserPreference = ({ providers }: UserPreferenceProps) => {
  const noSelectedProvider = useNoSelectedProvider();

  return (
    <div className="user-preference">
      <UserMenu />
      {providers && providers.length > 0 && !noSelectedProvider && (
        <Contrast>
          <SelectProvider />
        </Contrast>
      )}
    </div>
  );
};

export default UserPreference;
