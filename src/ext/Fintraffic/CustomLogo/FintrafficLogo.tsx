import './styles.scss';
import { useIntl } from 'react-intl';
import logo from './logo.png';
import React from 'react';

export const FintrafficLogo = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="custom-logo-wrapper">
      <img
        className="logo"
        src={logo}
        alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
      />
      <div>{formatMessage({ id: 'appLogoTitle' })}</div>
    </div>
  );
};
