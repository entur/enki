import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
  CheckIcon,
  CloseIcon,
  ValidationErrorIcon,
  WarningIcon,
  ValidationInfoIcon
} from '@entur/icons';

import '../../../styles.scss';

class Note extends Component {
  componentDidMount() {
    const { onDismiss, dismissAfter } = this.props;
    const transitionIntervall = 500;
    setTimeout(onDismiss, dismissAfter + transitionIntervall);
  }

  getTypeIcon(type) {
    if (type === 'success') {
      return (
        <span className="notification-icon success">
          <CheckIcon />
        </span>
      );
    } else if (type === 'error') {
      return (
        <span className="notification-icon error">
          <ValidationErrorIcon />
        </span>
      );
    } else if (type === 'warning') {
      return (
        <span className="notification-icon warning">
          <WarningIcon />
        </span>
      );
    } else if (type === 'info') {
      return (
        <span className="notification-icon info">
          <ValidationInfoIcon />
        </span>
      );
    } else {
      return null;
    }
  }

  onRequestClose() {
    const { onRequestClose } = this.props;
    if (typeof onRequestClose === 'function') {
      onRequestClose.call();
    }
  }

  render() {
    const { title, message, isActive, type, topOffset } = this.props;

    const wrapperClassNames = cx(
      'notification-default',
      'notification',
      { 'notification-active': isActive },
      { active: isActive },
      'notification-' + type
    );

    const titleClassNames = cx('notification-bar-label', type);

    return (
      <div className={wrapperClassNames} style={topOffset}>
        <div className="notification-close">
          <CloseIcon onClick={this.onRequestClose.bind(this)} />
        </div>
        <div className="notification-bar-wrapper">
          <div className="notification-bar-title">
            {this.getTypeIcon(type)}
            <span className={titleClassNames}>{title}</span>
          </div>
          <div className="notification-bar-message">{message}</div>
        </div>
      </div>
    );
  }
}

Note.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func,
  onDismiss: PropTypes.func.isRequired,
  dismissAfter: PropTypes.number,
  topOffset: PropTypes.object,
  isActive: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired
};

Note.defaultProps = {
  isActive: false,
  activeClassName: 'notification-bar-active',
  dismissAfter: 0
};

export default Note;
