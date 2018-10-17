import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import { UserIcon, ArrowIcon } from '@entur/component-library';

import Menu from '../../../../../../components/Menu';
import MenuItem from '../../../../../../components/Menu/MenuItem';
import Popover from '../../../../../../components/Popover';
import { Checkbox } from '../../../../../../components/icons';
import { getMessages, LOCALE_KEY } from '../../../../../../i18n';

import './styles.css';

class UserMenu extends React.Component {
  state = { open: false };

  setOpen(open) {
    this.setState({ open });
  }

  handleChangeLocale(locale) {
    const messages = getMessages(locale);
    this.props.dispatch(updateIntl({ locale, messages }));
    localStorage.setItem(LOCALE_KEY, locale);
  }

  render() {
    const { familyName, givenName, logoutUrl, locale } = this.props;
    const { open } = this.state;

    return (
      <div className="user-menu" onClick={() => this.setOpen(true)}>
        <div className="user-icon">
          <UserIcon color="#ffffff" />
        </div>
        <div className="name">{givenName + ' ' + familyName}</div>
        <ArrowIcon className="arrow-icon" color="#eee" />

        <Popover open={open} onRequestClose={() => this.setOpen(false)}>
          <Menu className="popover">
            <MenuItem
              menuItems={[
                <MenuItem
                  key={0}
                  onClick={() => {
                    this.handleChangeLocale('nb');
                  }}
                >
                  <div className="locale">
                    <Checkbox checked={locale === 'nb'} />
                    <span>Norsk</span>
                  </div>
                </MenuItem>,
                <MenuItem
                  key={1}
                  onClick={() => {
                    this.handleChangeLocale('en');
                  }}
                >
                  <div className="locale">
                    <Checkbox checked={locale === 'en'} />
                    <span>Engelsk</span>
                  </div>
                </MenuItem>
              ]}
            >
              Språk
            </MenuItem>
            <a href={logoutUrl} className="log-out-link">
              <MenuItem>Logg ut</MenuItem>
            </a>
          </Menu>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({ user, intl }) => ({
  logoutUrl: user.logoutUrl,
  familyName: user.familyName,
  givenName: user.givenName,
  locale: intl.locale
});

export default compose(connect(mapStateToProps))(UserMenu);
