import React, { useState } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserPreference from './UserPreference';
import { Contrast } from '@entur/layout';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import { RouteComponentProps } from 'react-router';
import { selectIntl } from 'i18n';
import messages from './messages';
import appMessages from '../../messages';
import { SideNavigation, SideNavigationItem } from '@entur/menu';
import { setSavedChanges } from 'actions/editor';
import { GlobalState } from 'reducers';
import { IntlShape } from 'react-intl';
import logo from 'static/img/logo.png';
import './styles.scss';

const isActive = (pathname: string, path: string) =>
  pathname.split('/')[1] === path.split('/')[1];

type RedirectType = {
  showConfirm: boolean;
  path: string;
  shouldRedirect: boolean;
};

type NavBarItemProps = RouteComponentProps & {
  text: string;
  path: string;
  className?: string;
  setRedirect: (redirect: RedirectType) => void;
};

const NavBarItem = withRouter(
  ({ location, text, path, className, setRedirect }: NavBarItemProps) => {
    const isSaved = useSelector<GlobalState, boolean>(
      state => state.editor.isSaved
    );
    const handleOnClick = (e: React.MouseEvent) => {
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
  const { formatMessage } = useSelector<GlobalState, IntlShape>(selectIntl);
  const [redirect, setRedirect] = useState<RedirectType>({
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
          text={formatMessage(messages.stopPlacesMenuItemLabel)}
          path="/stop-places"
          setRedirect={setRedirect}
        />
        <NavBarItem
          text={formatMessage(messages.linesMenuItemLabel)}
          path="/lines"
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
            <SecondaryButton
              key={1}
              onClick={() => setRedirect({ ...redirect, shouldRedirect: true })}
            >
              {formatMessage(messages.yes)}
            </SecondaryButton>,
            <PrimaryButton
              key={2}
              onClick={() => setRedirect({ ...redirect, showConfirm: false })}
            >
              {formatMessage(messages.no)}
            </PrimaryButton>
          ]}
          onDismiss={() => setRedirect({ ...redirect, showConfirm: false })}
        />
      )}

      {shouldRedirect && <RedirectHandler />}
    </Contrast>
  );
};

export default NavBar;
