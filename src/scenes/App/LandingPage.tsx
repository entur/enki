import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useAuth } from '../../auth/auth';
import logo from '../../static/img/logo.png';
import React from 'react';
import { Contrast } from '@entur/layout';
import { SideNavigation } from '@entur/menu';
import { PrimaryButton } from '@entur/button';
import LanguagePicker from './NavBar/LanguagePicker';
import Logo from './NavBar/Logo';
import SandboxFeature from '../../ext/SandboxFeature';
import { useConfig } from '../../config/ConfigContext';

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const { extPath } = useConfig();
  const auth = useAuth();
  return (
    <div className="app">
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <div>
        <div className="navbar-and-routes">
          <Contrast as="nav" className="navbar-wrapper">
            <SideNavigation className="side-navigation">
              <SandboxFeature
                feature={`${extPath}/CustomLogo`}
                renderFallback={() => <Logo />}
              />
            </SideNavigation>
            <div className="bottom-chips">
              <LanguagePicker />
            </div>
          </Contrast>
          <div className="header-and-routes">
            <div className="routes">
              <h1>{formatMessage({ id: 'landingPageNotLoggedIn' })}</h1>
              <p>
                <PrimaryButton onClick={() => auth.login(window.location.href)}>
                  {formatMessage({ id: 'landingPageLoginButtonText' })}
                </PrimaryButton>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
