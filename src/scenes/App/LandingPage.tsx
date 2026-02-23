import { Helmet } from 'react-helmet-async';
import { useIntl } from 'react-intl';
import { useAuth } from '../../auth/auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useConfig } from '../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';
import { DefaultLogo } from './DefaultLogo';

export const LandingPage = () => {
  const { formatMessage } = useIntl();
  const { extPath } = useConfig();
  const auth = useAuth();

  return (
    <div>
      <Helmet defaultTitle={formatMessage({ id: 'appTitle' })} />
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: { xs: '64px' },
          }}
        >
          <ComponentToggle
            feature={`${extPath}/CustomLogo`}
            renderFallback={() => (
              <DefaultLogo title={formatMessage({ id: 'appTitle' })} />
            )}
          />
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: '64px' }} />
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ mt: 4, alignItems: 'center' }}>
          <Typography variant="h1">
            {formatMessage({ id: 'landingPageNotLoggedIn' })}
          </Typography>
          <Button
            variant="contained"
            onClick={() => auth.login(globalThis.location.href)}
          >
            {formatMessage({ id: 'landingPageLoginButtonText' })}
          </Button>
        </Stack>
      </Container>
    </div>
  );
};
