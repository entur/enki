import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { useTheme } from '@mui/material/styles';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';
import { useAppSelector } from '../../../store/hooks';
import { useConfig } from '../../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';
import logo from 'static/img/logo.png';

const DRAWER_WIDTH = 300;

const isActive = (pathname: string, path: string) =>
  pathname.split('/')[1] === path.split('/')[1];

type RedirectType = {
  showConfirm: boolean;
  path: string;
};

type DrawerNavItemProps = {
  text: string;
  path: string;
  setRedirect: (redirect: RedirectType) => void;
  onClose: () => void;
  icon?: React.ReactNode;
  sx?: object;
};

const DrawerNavItem = ({
  text,
  path,
  setRedirect,
  onClose,
  icon,
  sx,
}: DrawerNavItemProps) => {
  const isSaved = useAppSelector((state) => state.editor.isSaved);
  const location = useLocation();

  const handleOnClick = (e: React.MouseEvent) => {
    if (!isSaved) {
      e.preventDefault();
      setRedirect({ showConfirm: true, path });
      return;
    }
    onClose();
  };

  return (
    <ListItemButton
      onClick={handleOnClick}
      selected={isActive(location.pathname, path)}
      component={Link}
      to={path}
      sx={sx}
    >
      {icon && <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>}
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ open, onClose }: MenuDrawerProps) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const active = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );
  const isAdmin = useAppSelector((state) => state.userContext.isAdmin);
  const { extPath } = useConfig();
  const [redirect, setRedirect] = useState<RedirectType>({
    showConfirm: false,
    path: '',
  });
  const [flexibleOpen, setFlexibleOpen] = useState(true);

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: DRAWER_WIDTH,
            },
          },
        }}
      >
        {/* Drawer header */}
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="logo" style={{ height: 24 }} />
            <Typography variant="h6" noWrap sx={{ ml: 1 }}>
              {formatMessage({ id: 'appTitle' })}
            </Typography>
          </Box>
          <IconButton onClick={onClose} color="inherit">
            <ChevronRight />
          </IconButton>
        </Toolbar>
        <Divider />

        {/* Navigation items */}
        <List disablePadding>
          {active && (
            <>
              <DrawerNavItem
                text={formatMessage({ id: 'navBarLinesMenuItemLabel' })}
                path="/lines"
                setRedirect={setRedirect}
                onClose={onClose}
              />

              <ListItemButton onClick={() => setFlexibleOpen(!flexibleOpen)}>
                <ListItemText
                  primary={formatMessage({
                    id: 'navBarFlexibleOffersSubMenuHeaderLabel',
                  })}
                />
                {flexibleOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={flexibleOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <DrawerNavItem
                    text={formatMessage({
                      id: 'navBarFlexibleLinesMenuItemLabel',
                    })}
                    path="/flexible-lines"
                    setRedirect={setRedirect}
                    onClose={onClose}
                    sx={{ pl: 4 }}
                  />
                  <DrawerNavItem
                    text={formatMessage({
                      id: 'navBarStopPlacesMenuItemLabel',
                    })}
                    path="/stop-places"
                    setRedirect={setRedirect}
                    onClose={onClose}
                    sx={{ pl: 4 }}
                  />
                </List>
              </Collapse>

              <DrawerNavItem
                text={formatMessage({ id: 'navBarNetworksMenuItemLabel' })}
                path="/networks"
                setRedirect={setRedirect}
                onClose={onClose}
              />
              <DrawerNavItem
                text={formatMessage({ id: 'navBarBrandingsMenuItemLabel' })}
                path="/brandings"
                setRedirect={setRedirect}
                onClose={onClose}
              />
              <DrawerNavItem
                text={formatMessage({ id: 'navBarDayTypesMenuItemLabel' })}
                path="/day-types"
                setRedirect={setRedirect}
                onClose={onClose}
              />
              <DrawerNavItem
                text={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
                path="/exports"
                setRedirect={setRedirect}
                onClose={onClose}
              />
            </>
          )}

          {isAdmin && (
            <DrawerNavItem
              icon={<LockOutlined />}
              text={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
              path="/providers"
              setRedirect={setRedirect}
              onClose={onClose}
            />
          )}
        </List>

        <ComponentToggle
          feature={`${extPath}/Navbar`}
          renderFallback={() => <></>}
        />
      </Drawer>

      {redirect.showConfirm && (
        <NavigateConfirmBox
          hideDialog={() => setRedirect({ ...redirect, showConfirm: false })}
          redirectTo={redirect.path}
          title={formatMessage({ id: 'redirectTitle' })}
          description={formatMessage({ id: 'redirectMessage' })}
          confirmText={formatMessage({ id: 'redirectYes' })}
          cancelText={formatMessage({ id: 'redirectNo' })}
        />
      )}
    </>
  );
};

export default MenuDrawer;
