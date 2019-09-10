import React, { Component } from 'react';
import { connect } from 'react-redux';

import NotificationStack from './NotificationStack';

class Notification extends Component {
  state = {
    notifications: []
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.notification !== null) {
      this.setState({
        notifications: [...this.state.notifications, nextProps.notification]
      });
    }
  }

  handleOnRequestClose(note) {
    if (note && note.key) {
      this.setState(prevState => ({
        notifications: prevState.notifications.filter(n => n.key !== note.key)
      }));
    }
  }

  handleOnDismiss({ key }) {
    this.setState(({ notifications }) => ({
      notifications: notifications.filter(
        notification => notification.key !== key
      )
    }));
  }

  render() {
    const { notifications } = this.state;

    return (
      <NotificationStack
        notifications={notifications}
        onDismiss={this.handleOnDismiss.bind(this)}
        onRequestClose={this.handleOnRequestClose.bind(this)}
      />
    );
  }
}

const mapStateToProps = ({ notification }) => ({
  notification
});

export default connect(mapStateToProps)(Notification);
