import './styles.scss';
import { useIntl } from 'react-intl';
import logo from './logo.png';
import React from 'react';

const Logo = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="logo-wrapper">
      <img
        className="logo"
        src={logo}
        alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
      />
      <div>{formatMessage({ id: 'appLongTitle' })}</div>
    </div>
  );
};

export default Logo;
