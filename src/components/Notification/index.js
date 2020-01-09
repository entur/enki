import React, { Component } from 'react';
import { connect } from 'react-redux';

import NotificationStack from './NotificationStack';

class Notification extends Component {
  state = {
    notifications: []
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.notification !== null &&
      this.props.notification !== prevProps.notification
    ) {
      this.setState({
        notifications: [...this.state.notifications, this.props.notification]
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
