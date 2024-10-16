import { useIntl } from 'react-intl';
import { useAuth } from '../../../auth/auth';
import { Helmet } from 'react-helmet';
import React from 'react';
import { Shortcut } from './Shortcut/types';
import Footer from './Footer/Footer';
import ShortcutPanel from './Shortcut/ShortcutPanel';
import FintrafficNavbar from './Navigation/FintrafficNavbar';
import { BrowserRouter } from 'react-router-dom';
import RaeLandingNavbar from './Navigation/RaeLandingNavbar';
import LoginSvg from '../static/svg/login.svg?react';
import NewUserSvg from '../static/svg/new_user.svg?react';
import './styles.scss';
import { createAccount, useMsalProvider } from '../Auth/msal';
import { useConfig } from '../../../config/ConfigContext';
import { MsalProvider } from '@azure/msal-react';
import { FintrafficConfig } from '../Config/types';

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const auth = useAuth();
  const config = useConfig() as FintrafficConfig;
  const { msalInstance } = useMsalProvider(config.msalConfig, auth);

  const shortcuts: Shortcut[] = [
    {
      label: formatMessage({ id: 'login' }),
      icon: <LoginSvg />,
      to: '/',
      onClick: () => auth.login(config.msalConfig.auth.redirectUri),
      description: formatMessage({ id: 'loginIntro' }),
    },
    {
      label: formatMessage({ id: 'register' }),
      icon: <NewUserSvg />,
      to: '/',
      onClick: () =>
        msalInstance && createAccount(msalInstance, config.msalConfig),
      description: formatMessage({ id: 'registerIntro' }),
    },
  ];
  const basename = import.meta.env.BASE_URL;

  return (
    <div className={'app-layout'}>
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <BrowserRouter basename={basename}>
        {msalInstance && (
          <MsalProvider instance={msalInstance}>
            <FintrafficNavbar />
            <RaeLandingNavbar />
            <div className={'page-content'}>
              <h1>{formatMessage({ id: 'rae' })}</h1>
              <div className={'page-intro'}>
                <p>{formatMessage({ id: 'Sometext' })}</p>
                <p>{formatMessage({ id: 'Moretext' })}</p>
              </div>
              <h2>{formatMessage({ id: 'shortcuts' })}</h2>
              <ShortcutPanel items={shortcuts} />
            </div>
            <Footer />
          </MsalProvider>
        )}
      </BrowserRouter>
    </div>
  );
};
