import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserPreference from 'scenes/App/components/NavBar/UserPreference';
import { Contrast } from '@entur/layout';
import { RouteComponentProps } from 'react-router';
import { AppIntlState, selectIntl } from 'i18n';
import { SideNavigation, SideNavigationItem } from '@entur/menu';
import { GlobalState } from 'reducers';
import logo from 'static/img/logo.png';
import './styles.scss';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';

const isActive = (pathname: string, path: string) =>
  pathname.split('/')[1] === path.split('/')[1];

type RedirectType = {
  showConfirm: boolean;
  path: string;
};

type NavBarItemProps = RouteComponentProps & {
  text: string;
  path: string;
  className?: string;
  setRedirect: (redirect: RedirectType) => void;
};

const NavBarItem = withRouter(
  ({ location, text, path, className, setRedirect }: NavBarItemProps) => {
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
      >
        {text}
      </SideNavigationItem>
    );
  }
);

const NavBar = () => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const [redirect, setRedirect] = useState<RedirectType>({
    showConfirm: false,
    path: '',
  });

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

        <UserPreference />

        <NavBarItem
          text={formatMessage('navBarIntroduction')}
          path="/get-started"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage('navBarStopPlacesMenuItemLabel')}
          path="/stop-places"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage('navBarLinesMenuItemLabel')}
          path="/lines"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage('navBarExportsMenuItemLabel')}
          path="/exports"
          className="exports"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage('navBarNetworksMenuItemLabel')}
          path="/networks"
          setRedirect={setRedirect}
        />
      </SideNavigation>
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
