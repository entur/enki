import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserPreference from './UserPreference';
import { Contrast } from '@entur/layout';
import { RouteComponentProps } from 'react-router';
import { selectIntl } from 'i18n';
import messages from './messages';
import appMessages from '../../messages';
import { SideNavigation, SideNavigationItem } from '@entur/menu';
import { GlobalState } from 'reducers';
import { IntlShape } from 'react-intl';
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
      state => state.editor.isSaved
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
  const { formatMessage } = useSelector<GlobalState, IntlShape>(selectIntl);
  const [redirect, setRedirect] = useState<RedirectType>({
    showConfirm: false,
    path: ''
  });

  return (
    <Contrast as="nav" className="navbar-wrapper">
      <SideNavigation className="side-navigation">
        <Link to="/">
          <div className="logo-wrapper">
            <img
              className="logo"
              src={logo}
              alt={formatMessage(messages.rootLinkLogoAltText)}
            />
            <span>{formatMessage(appMessages.title)}</span>
          </div>
        </Link>

        <UserPreference />

        <NavBarItem
          text={formatMessage(messages.HomeMenuItemLabel)}
          path="/"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.networksMenuItemLabel)}
          path="/networks"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.stopPlacesMenuItemLabel)}
          path="/stop-places"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.linesMenuItemLabel)}
          path="/lines"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.exportsMenuItemLabel)}
          path="/exports"
          className="exports"
          setRedirect={setRedirect}
        />
      </SideNavigation>
      <NavigateConfirmBox
        showDialog={redirect.showConfirm}
        hideDialog={() => setRedirect({ ...redirect, showConfirm: false })}
        redirectTo={redirect.path}
        title={formatMessage(messages.title)}
        description={formatMessage(messages.message)}
        confirmText={formatMessage(messages.yes)}
        cancelText={formatMessage(messages.no)}
      />
    </Contrast>
  );
};

export default NavBar;
