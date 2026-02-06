import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useAuth } from '../../auth/auth';
import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import LanguagePicker from './NavBar/LanguagePicker';
import Logo from './NavBar/Logo';
import { useConfig } from '../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const { extPath } = useConfig();
  const auth = useAuth();
  return (
    <div className="app">
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <div>
        <div className="navbar-and-routes">
          <Box component="nav" className="navbar-wrapper">
            <List className="side-navigation">
              <ComponentToggle
                feature={`${extPath}/CustomLogo`}
                renderFallback={() => <Logo />}
              />
            </List>
            <div className="bottom-chips">
              <LanguagePicker />
            </div>
          </Box>
          <div className="header-and-routes">
            <div className="routes">
              <h1>{formatMessage({ id: 'landingPageNotLoggedIn' })}</h1>
              <p>
                <Button
                  variant="contained"
                  onClick={() => auth.login(window.location.href)}
                >
                  {formatMessage({ id: 'landingPageLoginButtonText' })}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
