import { useIntl } from 'react-intl';
import { useConfig } from '../../../config/ConfigContext';
import { useAuth } from '../../../auth/auth';
import { Helmet } from 'react-helmet';
import SandboxFeature from '../../SandboxFeature';
import LanguagePicker from '../../../scenes/App/NavBar/LanguagePicker';
import { PrimaryButton } from '@entur/button';
import React from 'react';
import { Shortcut } from './Shortcut/types';
import Footer from './Footer/Footer';
import ShortcutPanel from './Shortcut/ShortcutPanel';
import FintrafficNavbar from './Navigation/FintrafficNavbar';

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const { extPath } = useConfig();
  const auth = useAuth();

  const shortcuts: Shortcut[] = [
    {
      label: formatMessage({ id: 'login' }),
      icon: undefined, // <LoginSvg />,
      to: '/',
      onClick: () => {},
      description: formatMessage({ id: 'loginIntro' }),
    },
    {
      label: formatMessage({ id: 'register' }),
      icon: undefined, //<NewUserSvg />,
      to: '/',
      onClick: () => {},
      description: formatMessage({ id: 'registerIntro' }),
    },
  ];

  return (
    <div className="app-layout">
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <FintrafficNavbar />

      <ShortcutPanel items={shortcuts} />

      <h1>{formatMessage({ id: 'rae' })}</h1>
      <p>
        <PrimaryButton onClick={() => auth.login(window.location.href)}>
          {formatMessage({ id: 'landingPageLoginButtonText' })}
        </PrimaryButton>
      </p>

      <Footer />
    </div>
  );
};
