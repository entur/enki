import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserPreference from './UserPreference';
import NavBarMenuItem from './NavBarMenuItem';

import logo from '../../../../static/img/logo.png';

import './styles.scss';
import { selectIntl } from 'i18n';
import messages from './messages';
import appMessages from '../../messages';

const NavBar = () => {
  const { formatMessage } = useSelector(selectIntl);
  return (
    <div className="navbar">
      <Link to="/" className="link">
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

      <div className="items">
        <NavBarMenuItem
          key="networks"
          label={formatMessage(messages.networksMenuItemLabel)}
          path="/networks"
        />
        <NavBarMenuItem
          key="lines"
          label={formatMessage(messages.linesMenuItemLabel)}
          path="/lines"
        />
        <NavBarMenuItem
          key="stop-places"
          label={formatMessage(messages.stopPlacesMenuItemLabel)}
          path="/stop-places"
        />
        <NavBarMenuItem
          className="exports"
          key="exports"
          label={formatMessage(messages.exportsMenuItemLabel)}
          path="/exports"
        />
      </div>
    </div>
  );
};

export default NavBar;
