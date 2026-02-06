import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useAuth } from '../../auth/auth';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useConfig } from '../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';
import logo from 'static/img/logo.png';

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const { extPath } = useConfig();
  const auth = useAuth();
  const theme = useTheme();

  const DefaultLogo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={logo}
        alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
        style={{ height: 28, width: 'auto' }}
      />
      <Typography
        variant="h6"
        sx={{ ml: 1, fontWeight: 'bold', color: 'inherit' }}
      >
        {formatMessage({ id: 'appTitle' })}
      </Typography>
    </Box>
  );

  return (
    <div className="app">
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: { xs: '64px' },
          }}
        >
          <ComponentToggle
            feature={`${extPath}/CustomLogo`}
            renderFallback={() => <DefaultLogo />}
          />
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: '64px' }} />
      <Box className="app-root">
        <Box className="app-content">
          <h1>{formatMessage({ id: 'landingPageNotLoggedIn' })}</h1>
          <p>
            <Button
              variant="contained"
              onClick={() => auth.login(window.location.href)}
            >
              {formatMessage({ id: 'landingPageLoginButtonText' })}
            </Button>
          </p>
        </Box>
      </Box>
    </div>
  );
};
