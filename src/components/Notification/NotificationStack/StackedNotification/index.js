import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Note from './Note';

class StackedNotification extends Component {
  state = {
    isActive: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isActive: true
      });
    }, 100);
    this.handleDismiss(this.props.dismissAfter);
  }

  handleDismiss(dismissAfter) {
    setTimeout(() => {
      this.setState({
        isActive: false
      });
    }, dismissAfter);
  }

  onRequestClose() {
    this.handleDismiss(0);
    this.props.onRequestClose();
  }

  render() {
    return (
      <Note
        onRequestClose={this.props.onRequestClose}
        onDismiss={this.props.onDismiss}
        isActive={this.state.isActive}
        message={this.props.message}
        title={this.props.title}
        type={this.props.type}
        notificationStyle={this.props.notificationStyle}
        dismissAfter={this.props.dismissAfter}
      />
    );
  }
}

StackedNotification.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func,
  notificationStyle: PropTypes.object,
  dismissAfter: PropTypes.number
};

export default StackedNotification;
