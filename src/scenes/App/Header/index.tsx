import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/icons-material/Menu';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Logout from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import { ComponentToggle } from '@entur/react-component-toggle';
import { useAuth } from '../../../auth/auth';
import { useAppSelector } from '../../../store/hooks';
import { useConfig } from '../../../config/ConfigContext';
import { SelectProvider } from '../SelectProvider/SelectProvider';
import { useNoSelectedProvider } from '../useNoSelectedProvider';
import MenuDrawer from '../MenuDrawer';
import LanguagePickerMenu from './LanguagePickerMenu';
import logo from 'static/img/logo.png';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);
  const { formatMessage } = useIntl();
  const auth = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { extPath } = useConfig();
  const preferredName = useAppSelector(
    (state) => state.userContext.preferredName,
  );
  const providers = useAppSelector((state) => state.userContext.providers);
  const noSelectedProvider = useNoSelectedProvider();

  const handleLogout = useCallback(() => {
    setUserAnchorEl(null);
    auth.logout({ returnTo: window.location.origin });
  }, [auth]);

  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={logo}
        alt={formatMessage({ id: 'navBarRootLinkLogoAltText' })}
        style={{ height: 28, width: 'auto' }}
      />
      <Typography
        variant="h6"
        sx={{
          ml: 1,
          fontWeight: 'bold',
          color: 'inherit',
        }}
      >
        {formatMessage({ id: 'appTitle' })}
      </Typography>
    </Box>
  );

  return (
    <>
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
            width: '100%',
            minHeight: { xs: '64px' },
          }}
        >
          {/* Left: Logo + app title */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ComponentToggle
              feature={`${extPath}/CustomLogo`}
              renderFallback={() => <Logo />}
            />
          </Link>

          {/* Center: Provider selector (hidden on mobile) */}
          {!isMobile &&
            providers &&
            providers.length > 0 &&
            !noSelectedProvider && (
              <Box
                sx={{
                  mx: 3,
                  minWidth: 240,
                  maxWidth: 360,
                  flex: '0 1 auto',
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.7)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <SelectProvider />
              </Box>
            )}

          <Box sx={{ flex: 1 }} />

          {/* Right: Language picker, User menu, Hamburger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {!isMobile && (
              <>
                <LanguagePickerMenu />

                <IconButton
                  color="inherit"
                  onClick={(e) => setUserAnchorEl(e.currentTarget)}
                  aria-label={preferredName || 'User'}
                >
                  <PersonOutline />
                </IconButton>
                <Popover
                  open={Boolean(userAnchorEl)}
                  anchorEl={userAnchorEl}
                  onClose={() => setUserAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Box sx={{ p: 2, minWidth: 180 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {preferredName || 'Unknown'}
                    </Typography>
                    <Button
                      startIcon={<Logout />}
                      onClick={handleLogout}
                      size="small"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {formatMessage({ id: 'userMenuLogoutLinkText' })}
                    </Button>
                  </Box>
                </Popover>
              </>
            )}

            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              aria-label={formatMessage({ id: 'appTitle' })}
            >
              <Menu />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Header;
