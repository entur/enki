import React, { useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserPreference from './UserPreference';
import { Contrast } from '@entur/layout';
import { SecondaryButton, NegativeButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';

import logo from '../../../../static/img/logo.png';

import './styles.scss';
import { selectIntl } from 'i18n';
import messages from './messages';
import appMessages from '../../messages';
import { SideNavigation, SideNavigationItem } from '@entur/menu';
import { setSavedChanges } from 'actions/editor';

const isActive = (pathname, path) => {
  return pathname.split('/')[1] === path.split('/')[1];
};

const NavBarItem = withRouter(
  ({ location, text, path, className, setRedirect }) => {
    const { isSaved } = useSelector(state => state.editor);
    const handleOnClick = e => {
      if (isSaved) return;
      e.preventDefault();
      setRedirect({ showConfirm: true, path, shouldRedirect: false });
    };

    return (
      <SideNavigationItem
        onClick={handleOnClick}
        active={isActive(location.pathname, path)}
        as={Link}
        to={path}
        className={className}
      >
        {text}
      </SideNavigationItem>
    );
  }
);

const NavBar = () => {
  const { formatMessage } = useSelector(selectIntl);
  const [redirect, setRedirect] = useState({
    showConfirm: false,
    path: '',
    shouldRedirect: false
  });
  const { showConfirm, shouldRedirect, path } = redirect;
  const dispatch = useDispatch();

  const RedirectHandler = () => {
    setRedirect({ showConfirm: false, shouldRedirect: false, path: '' });
    dispatch(setSavedChanges(true));
    return <Redirect to={path} />;
  };

  return (
    <Contrast as="nav" className="navbar-wrapper">
      <SideNavigation className="side-navigation">
        <Link to="/">
          <div className="logo-wrapper">
            <img
              className="logo"
              src={logo}
              alt={formatMessage(messages.rootLinkLogoAltText)}
            />
            <span>{formatMessage(appMessages.title)}</span>
          </div>
        </Link>

        <UserPreference />

        <NavBarItem
          text={formatMessage(messages.HomeMenuItemLabel)}
          path="/"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.networksMenuItemLabel)}
          path="/networks"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.linesMenuItemLabel)}
          path="/lines"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.stopPlacesMenuItemLabel)}
          path="/stop-places"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.exportsMenuItemLabel)}
          path="/exports"
          className="exports"
          setRedirect={setRedirect}
        />
      </SideNavigation>

      {showConfirm && (
        <ConfirmDialog
          isOpen
          title={formatMessage(messages.title)}
          message={formatMessage(messages.message)}
          buttons={[
            <NegativeButton
              key={1}
              onClick={() => setRedirect({ ...redirect, shouldRedirect: true })}
            >
              {formatMessage(messages.yes)}
            </NegativeButton>,
            <SecondaryButton
              key={2}
              onClick={() => setRedirect({ ...redirect, showConfirm: false })}
            >
              {formatMessage(messages.no)}
            </SecondaryButton>
          ]}
          onDismiss={() => setRedirect({ ...redirect, showConfirm: false })}
        />
      )}

      {shouldRedirect && <RedirectHandler />}
    </Contrast>
  );
};

export default NavBar;
