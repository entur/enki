import stylesURL from './styles.scss?url';
import { useIntl } from 'react-intl';
import logo from './logo.png';
import React from 'react';
import { Helmet } from 'react-helmet';

export const FintrafficLogo = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Helmet>
        <link href={stylesURL} rel="stylesheet" media="all" />
      </Helmet>
      <div className="custom-logo-wrapper">
        <img
          className="logo"
          src={logo}
          alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
        />
        <div>{formatMessage({ id: 'appLogoTitle' })}</div>
      </div>
    </>
  );
};
