import { ClosedLockIcon } from '@entur/icons';
import { Contrast } from '@entur/layout';
import {
  SideNavigation,
  SideNavigationGroup,
  SideNavigationItem,
} from '@entur/menu';
import { useAuth } from 'app/auth';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';
import { useConfig } from 'config/ConfigContext';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import UserPreference from 'scenes/App/components/NavBar/UserPreference';
import logo from 'static/img/logo.png';
import { useAppSelector } from '../../../../app/hooks';
import LanguagePicker from './LanguagePicker';
import LogoutChip from './LogoutChip';
import './styles.scss';
import SandboxFeature from '../../../../config/SandboxFeature';
import { DayTypesEditorNavBarItemProps } from '../../../../ext/daytypes-editor/nav-bar-item/types';

const isActive = (pathname: string, path: string) =>
  pathname.split('/')[1] === path.split('/')[1];

export type RedirectType = {
  showConfirm: boolean;
  path: string;
};

type NavBarItemProps = {
  text: string;
  path: string;
  className?: string;
  setRedirect: (redirect: RedirectType) => void;
  icon?: React.ReactNode;
};

export const NavBarItem = ({
  text,
  path,
  className,
  setRedirect,
  icon,
}: NavBarItemProps) => {
  const isSaved = useAppSelector((state) => state.editor.isSaved);
  const handleOnClick = (e: React.MouseEvent) => {
    if (isSaved) return;
    e.preventDefault();
    setRedirect({ showConfirm: true, path });
  };

  return (
    <SideNavigationItem
      onClick={handleOnClick}
      active={isActive(location.pathname, path)}
      as={Link}
      to={path}
      className={className}
      icon={icon}
    >
      {text}
    </SideNavigationItem>
  );
};

const NavBar = () => {
  const { formatMessage } = useIntl();
  const { providers, active } = useAppSelector((state) => state.providers);
  const [redirect, setRedirect] = useState<RedirectType>({
    showConfirm: false,
    path: '',
  });

  const { roleAssignments } = useAuth();
  const { adminRole } = useConfig();

  return (
    <Contrast as="nav" className="navbar-wrapper">
      <SideNavigation className="side-navigation">
        <Link to="/">
          <div className="logo-wrapper">
            <img
              className="logo"
              src={logo}
              alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
            />
            <span>{formatMessage({ id: 'appTitle' })}</span>
          </div>
        </Link>

        {providers && providers.length > 0 && <UserPreference />}

        {active && (
          <>
            <NavBarItem
              text={formatMessage({ id: 'navBarLinesMenuItemLabel' })}
              path="/lines"
              setRedirect={setRedirect}
            />

            <SideNavigationGroup
              defaultOpen
              title={formatMessage({
                id: 'navBarFlexibleOffersSubMenuHeaderLabel',
              })}
            >
              <SideNavigation>
                <NavBarItem
                  text={formatMessage({
                    id: 'navBarFlexibleLinesMenuItemLabel',
                  })}
                  path="/flexible-lines"
                  setRedirect={setRedirect}
                />
                <NavBarItem
                  text={formatMessage({ id: 'navBarStopPlacesMenuItemLabel' })}
                  path="/stop-places"
                  setRedirect={setRedirect}
                />
              </SideNavigation>
            </SideNavigationGroup>

            <NavBarItem
              text={formatMessage({ id: 'navBarNetworksMenuItemLabel' })}
              path="/networks"
              setRedirect={setRedirect}
            />
            <NavBarItem
              text={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
              path="/exports"
              setRedirect={setRedirect}
            />

            <SandboxFeature<DayTypesEditorNavBarItemProps>
              feature="daytypes-editor/nav-bar-item"
              setRedirect={setRedirect}
            />
          </>
        )}

        {roleAssignments?.includes(adminRole!) && (
          <NavBarItem
            icon={<ClosedLockIcon />}
            text={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
            path="/providers"
            setRedirect={setRedirect}
          />
        )}
      </SideNavigation>

      <div className="bottom-chips">
        <LanguagePicker />
        <LogoutChip />
      </div>

      {redirect.showConfirm && (
        <NavigateConfirmBox
          hideDialog={() => setRedirect({ ...redirect, showConfirm: false })}
          redirectTo={redirect.path}
          title={formatMessage({ id: 'redirectTitle' })}
          description={formatMessage({ id: 'redirectMessage' })}
          confirmText={formatMessage({ id: 'redirectYes' })}
          cancelText={formatMessage({ id: 'redirectNo' })}
        />
      )}
    </Contrast>
  );
};

export default NavBar;
