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

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const auth = useAuth();

  const shortcuts: Shortcut[] = [
    {
      label: formatMessage({ id: 'login' }),
      icon: <LoginSvg />,
      to: '/',
      onClick: () => auth.login(window.location.href),
      description: formatMessage({ id: 'loginIntro' }),
    },
    {
      label: formatMessage({ id: 'register' }),
      icon: <NewUserSvg />,
      to: '/',
      onClick: () => {},
      description: formatMessage({ id: 'registerIntro' }),
    },
  ];
  const basename = import.meta.env.BASE_URL;

  return (
    <div className={'app-layout'}>
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <BrowserRouter basename={basename}>
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
      </BrowserRouter>
    </div>
  );
};
