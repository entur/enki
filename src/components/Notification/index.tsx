import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Notification as NotificationType } from 'reducers/notification';
import { usePrevious } from 'helpers/hooks';

import NotificationStack from './NotificationStack';
import { GlobalState } from 'reducers';

type Props = {
  notification: NotificationType | null;
};

const Notification = ({ notification }: Props) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const prevNotification = usePrevious(notification ?? {});

  useEffect(() => {
    if (notification && notification !== prevNotification) {
      setNotifications([...notifications, notification]);
    }
  }, [notification, notifications, prevNotification]);

  const handleOnRequestClose = (note: NotificationType) => {
    if (note?.key) {
      setNotifications(notifications.filter((n) => n.key !== note.key));
    }
  };

  const handleOnDismiss = ({ key }: NotificationType) => {
    setNotifications(
      notifications.filter((notification) => notification.key !== key)
    );
  };

  return (
    <NotificationStack
      notifications={notifications}
      onDismiss={handleOnDismiss}
      onRequestClose={handleOnRequestClose}
    />
  );
};

const mapStateToProps = ({ notification }: GlobalState) => ({
  notification,
});

export default connect(mapStateToProps)(Notification);
