import LockOutlined from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import UserPreference from 'scenes/App/NavBar/UserPreference';
import { useAppSelector } from '../../../store/hooks';
import LanguagePicker from './LanguagePicker';
import LogoutChip from './LogoutChip';
import './styles.scss';
import Logo from './Logo';
import { useConfig } from '../../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';

const isActive = (pathname: string, path: string) =>
  pathname.split('/')[1] === path.split('/')[1];

type RedirectType = {
  showConfirm: boolean;
  path: string;
};

type NavBarItemProps = {
  text: string;
  path: string;
  className?: string;
  setRedirect: (redirect: RedirectType) => void;
  icon?: React.ReactNode;
};

const NavBarItem = ({
  text,
  path,
  className,
  setRedirect,
  icon,
}: NavBarItemProps) => {
  const isSaved = useAppSelector((state) => state.editor.isSaved);
  const handleOnClick = (e: React.MouseEvent) => {
    if (isSaved) return;
    e.preventDefault();
    setRedirect({ showConfirm: true, path });
  };

  const location = useLocation();

  return (
    <ListItemButton
      onClick={handleOnClick}
      selected={isActive(location.pathname, path)}
      component={Link}
      to={path}
      className={className}
    >
      {icon && (
        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
          {icon}
        </ListItemIcon>
      )}
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

const NavBar = () => {
  const { formatMessage } = useIntl();
  const providers = useAppSelector((state) => state.userContext.providers);
  const active = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );
  const [redirect, setRedirect] = useState<RedirectType>({
    showConfirm: false,
    path: '',
  });
  const [flexibleOpen, setFlexibleOpen] = useState(true);
  const { extPath } = useConfig();

  const isAdmin = useAppSelector((state) => state.userContext.isAdmin);

  return (
    <Box component="nav" className="navbar-wrapper">
      <List className="side-navigation">
        <Link to={'/'}>
          <ComponentToggle
            feature={`${extPath}/CustomLogo`}
            renderFallback={() => <Logo />}
          />
        </Link>

        <UserPreference providers={providers} />

        {active && (
          <>
            <NavBarItem
              text={formatMessage({ id: 'navBarLinesMenuItemLabel' })}
              path="/lines"
              setRedirect={setRedirect}
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
                <NavBarItem
                  text={formatMessage({
                    id: 'navBarFlexibleLinesMenuItemLabel',
                  })}
                  path="/flexible-lines"
                  setRedirect={setRedirect}
                />
                <NavBarItem
                  text={formatMessage({ id: 'navBarStopPlacesMenuItemLabel' })}
                  path="/stop-places"
                  setRedirect={setRedirect}
                />
              </List>
            </Collapse>

            <NavBarItem
              text={formatMessage({ id: 'navBarNetworksMenuItemLabel' })}
              path="/networks"
              setRedirect={setRedirect}
            />
            <NavBarItem
              text={formatMessage({ id: 'navBarBrandingsMenuItemLabel' })}
              path="/brandings"
              setRedirect={setRedirect}
            />
            <NavBarItem
              text={formatMessage({ id: 'navBarDayTypesMenuItemLabel' })}
              path="/day-types"
              setRedirect={setRedirect}
            />
            <NavBarItem
              text={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
              path="/exports"
              setRedirect={setRedirect}
            />
          </>
        )}

        {isAdmin && (
          <NavBarItem
            icon={<LockOutlined />}
            text={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
            path="/providers"
            setRedirect={setRedirect}
          />
        )}

        <ComponentToggle
          feature={`${extPath}/Navbar`}
          renderFallback={() => <></>}
        />
      </List>

      <div className="bottom-chips">
        <LanguagePicker />
        <LogoutChip />
      </div>

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
    </Box>
  );
};

export default NavBar;
