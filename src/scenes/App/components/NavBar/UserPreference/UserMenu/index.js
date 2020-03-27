import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import { RightArrowIcon, UserIcon } from '@entur/icons';

import Menu from 'components/Menu';
import MenuItem from 'components/Menu/MenuItem';
import Popover from 'components/Popover';
import { Checkbox } from '@entur/form';
import { getMessages, LOCALE_KEY, selectIntl } from 'i18n';

import './styles.scss';

const UserMenu = () => {
  const [open, setOpen] = useState(false);

  const { familyName, givenName, logoutUrl } = useSelector(({ user }) => user);
  const locale = useSelector(({ intl }) => intl.locale);
  const { formatMessage } = useSelector(selectIntl);

  const dispatch = useDispatch();

  const handleChangeLocale = useCallback(
    (locale) => {
      const { messages } = getMessages(locale);
      dispatch(updateIntl({ locale, messages }));
      localStorage.setItem(LOCALE_KEY, locale);
    },
    [dispatch]
  );

  return (
    <div className="user-menu" onClick={() => setOpen(true)}>
      <div className="user-icon">
        <UserIcon color="#ffffff" />
      </div>
      <div className="name">{givenName + ' ' + familyName}</div>
      <RightArrowIcon className="arrow-icon" />

      <Popover open={open} onRequestClose={() => setOpen(false)}>
        <Menu className="popover">
          <MenuItem
            menuItems={[
              <MenuItem
                key={0}
                onClick={() => {
                  handleChangeLocale('nb');
                }}
              >
                <div className="locale">
                  <Checkbox checked={locale === 'nb'} readOnly />
                  <span>{formatMessage('userMenuMenuItemTextNorwegian')}</span>
                </div>
              </MenuItem>,
              <MenuItem
                key={1}
                onClick={() => {
                  handleChangeLocale('en');
                }}
              >
                <div className="locale">
                  <Checkbox checked={locale === 'en'} readOnly />
                  <span>{formatMessage('userMenuMenuItemTextEnglish')}</span>
                </div>
              </MenuItem>,
            ]}
          >
            {formatMessage('userMenuMenuItemTextLanguage')}
          </MenuItem>
          <a href={logoutUrl} className="log-out-link">
            <MenuItem>{formatMessage('userMenuLogoutLinkText')}</MenuItem>
          </a>
        </Menu>
      </Popover>
    </div>
  );
};

export default UserMenu;
