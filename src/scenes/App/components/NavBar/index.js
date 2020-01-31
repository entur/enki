import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserPreference from './UserPreference';
import { Contrast } from '@entur/layout';

import logo from '../../../../static/img/logo.png';

import './styles.scss';
import { selectIntl } from 'i18n';
import messages from './messages';
import appMessages from '../../messages';
import { SideNavigation, SideNavigationItem } from '@entur/menu';

const isActive = (pathname, path) => {
  return pathname.split('/')[1] === path.split('/')[1];
};

const NavBarItem = withRouter(({ location, text, path, className }) => {
  return (
    <SideNavigationItem
      active={isActive(location.pathname, path)}
      as={Link}
      to={path}
      className={className}
    >
      {text}
    </SideNavigationItem>
  );
});

const NavBar = ({ location }) => {
  const { formatMessage } = useSelector(selectIntl);

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
          text={formatMessage(messages.networksMenuItemLabel)}
          path="/networks"
        />
        <NavBarItem
          text={formatMessage(messages.linesMenuItemLabel)}
          path="/lines"
        />
        <NavBarItem
          text={formatMessage(messages.stopPlacesMenuItemLabel)}
          path="/stop-places"
        />
        <NavBarItem
          text={formatMessage(messages.exportsMenuItemLabel)}
          path="/exports"
          className="exports "
        />
      </SideNavigation>
    </Contrast>
  );
};

export default NavBar;
