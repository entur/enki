import './styles.scss';
import logo from 'static/img/logo.png';
import React from 'react';
import { useIntl } from 'react-intl';

const Logo = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="logo-wrapper">
      <img
        className="logo"
        src={logo}
        alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
      />
      <span>{formatMessage({ id: 'appTitle' })}</span>
    </div>
  );
};

export default Logo;
