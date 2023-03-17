import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserPreference from 'scenes/App/components/NavBar/UserPreference';
import { Contrast } from '@entur/layout';
import { AppIntlState, selectIntl } from 'i18n';
import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '@entur/menu';
import { GlobalState } from 'reducers';
import logo from 'static/img/logo.png';
import './styles.scss';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';
import LanguagePicker from './LanguagePicker';
import LogoutChip from './LogoutChip';
import { ClosedLockIcon } from '@entur/icons';
import { useAuth } from '@entur/auth-provider';
import { useConfig } from 'config/ConfigContext';
import { ProvidersState } from 'reducers/providers';

const isActive = (pathname: string, path: string) =>
  pathname.split('/')[1] === path.split('/')[1];

type RedirectType = {
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

const NavBarItem = ({
  text,
  path,
  className,
  setRedirect,
  icon,
}: NavBarItemProps) => {
  const isSaved = useSelector<GlobalState, boolean>(
    (state) => state.editor.isSaved
  );
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
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const { providers, active } = useSelector<GlobalState, ProvidersState>(
    (state) => state.providers
  );
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
              alt={formatMessage('navBarRootLinkLogoAltText')}
            />
            <span>{formatMessage('appTitle')}</span>
          </div>
        </Link>

        {providers && providers.length > 0 && <UserPreference />}

        {active && (
          <>
            <NavBarItem
              text={formatMessage('navBarLinesMenuItemLabel')}
              path="/lines"
              setRedirect={setRedirect}
            />

            <SideNavigationGroup
              defaultOpen
              title={formatMessage('navBarFlexibleOffersSubMenuHeaderLabel')}
            >
              <SideNavigation>
                <NavBarItem
                  text={formatMessage('navBarFlexibleLinesMenuItemLabel')}
                  path="/flexible-lines"
                  setRedirect={setRedirect}
                />
                <NavBarItem
                  text={formatMessage('navBarStopPlacesMenuItemLabel')}
                  path="/stop-places"
                  setRedirect={setRedirect}
                />
              </SideNavigation>
            </SideNavigationGroup>

            <NavBarItem
              text={formatMessage('navBarNetworksMenuItemLabel')}
              path="/networks"
              setRedirect={setRedirect}
            />
            <NavBarItem
              text={formatMessage('navBarExportsMenuItemLabel')}
              path="/exports"
              setRedirect={setRedirect}
            />
          </>
        )}

        {roleAssignments?.includes(adminRole) && (
          <NavBarItem
            icon={<ClosedLockIcon />}
            text={formatMessage('navBarProvidersMenuItemLabel')}
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
          title={formatMessage('redirectTitle')}
          description={formatMessage('redirectMessage')}
          confirmText={formatMessage('redirectYes')}
          cancelText={formatMessage('redirectNo')}
        />
      )}
    </Contrast>
  );
};

export default NavBar;
