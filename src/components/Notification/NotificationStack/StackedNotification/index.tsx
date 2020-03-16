import React, { useState, useEffect } from 'react';

import Note from './Note';
import { Notification } from 'reducers/notification';
import { NotificationTypes, NotificationDuration } from 'actions/notification';

type Props = Notification & {
  title: string;
  message: string;
  onDismiss: () => void;
  notificationStyle?: Object;
  dismissAfter: NotificationDuration;
  type: NotificationTypes | null;
};

const StackedNotification = (props: Props) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(true);
    }, 100);

    setTimeout(() => {
      setIsActive(false);
    }, props.dismissAfter);
  }, [props.dismissAfter]);

  return (
    <Note
      onRequestClose={() => setIsActive(false)}
      onDismiss={props.onDismiss}
      isActive={isActive}
      message={props.message}
      title={props.title}
      type={props.type}
      notificationStyle={props.notificationStyle}
      dismissAfter={props.dismissAfter}
    />
  );
};

export default StackedNotification;
