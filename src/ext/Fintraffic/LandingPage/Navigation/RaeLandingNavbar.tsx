import { FdsNavigationVariant } from '../../Fds/fds-navigation';
import Navbar from './Navbar';
import { FdsNavigationItem } from '../../Fds/fds-navigation';
import {
  aboutItem,
  getSelectedLocaleItem,
  loginItem,
  registerItem,
  supportItem,
  raeItem,
} from './navbarItems';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAuth } from '../../../../auth/auth';

const RaeLandingNavbar = () => {
  const [userNavbarItems, setUserNavbarItems] = useState<FdsNavigationItem[]>(
    [],
  );
  const intl = useIntl();
  const auth = useAuth();

  useEffect(() => {
    const { formatMessage } = intl;
    // This 'formatMessage' from a hook has to be used because that's the only way to have
    // these translation updated with user's actual selected language and not the default one
    const raeNavbarItems: FdsNavigationItem[] = [
      raeItem(),
      aboutItem(formatMessage),
      supportItem(formatMessage),
      loginItem(formatMessage, auth.login),
      registerItem(formatMessage),
      getSelectedLocaleItem(intl.locale, formatMessage),
    ];
    setUserNavbarItems(raeNavbarItems);
  }, [intl, auth.login]);

  return (
    <>
      <Navbar
        variant={FdsNavigationVariant.secondary}
        items={userNavbarItems}
        barIndex={1}
        selectedItem={userNavbarItems[0]}
        isSelectedItemStatic={false}
      />
    </>
  );
};

export default RaeLandingNavbar;
