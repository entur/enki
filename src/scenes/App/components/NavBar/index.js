import React from 'react';
import { Link } from 'react-router-dom';

import UserPreference from './UserPreference';
import NavBarMenuItem from './NavBarMenuItem';

import logo from '../../../../static/img/logo.png';

import './styles.css';

const NavBar = () => (
  <div className="navbar">
    <Link to="/" className="link">
      <div className="logo-wrapper">
        <img className="logo" src={logo} alt="Logo for Entur Bestillingstransport" />
        <span>BESTILLINGSTRANSPORT</span>
      </div>
    </Link>

    <UserPreference />

    <div className="items">
      <NavBarMenuItem
        key="networks"
        label="Nettverk"
        path="/networks"
      />
      <NavBarMenuItem
        key="lines"
        label="Linjer"
        path="/lines"
      />
      <NavBarMenuItem
        key="stop-places"
        label="Stoppesteder"
        path="/stop-places"
      />
      <NavBarMenuItem
        className="exports"
        key="exports"
        label="Eksporter"
        path="/exports"
      />
    </div>
  </div>
);

export default NavBar;
