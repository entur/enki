import React from 'react';
import PropTypes from 'prop-types';

import StackedNotification from './StackedNotification';

const getNotificationStyle = (index, style = {}) => ({
  ...style,
  top: `${2 + index * 8}rem`
});

const NotificationStack = props => (
  <div className="notification-list">
    {props.notifications.map((notification, index) => {
      const isLast = props.notifications.length - 1 === index;
      const dismissNow = isLast || !props.dismissInOrder;
      const notificationStyle = getNotificationStyle(
        index,
        notification.notificationStyle
      );

      // Allow onClick from notification stack or individual notifications
      const onRequestClose =
        notification.onRequestClose || props.onRequestClose;

      let dismissAfter =
        typeof notification.dismissAfter !== 'undefined'
          ? notification.dismissAfter
          : props.dismissAfter;

      if (!dismissNow) {
        dismissAfter += index * 1000;
      }

      return (
        <StackedNotification
          {...notification}
          key={notification.key}
          isLast={isLast}
          action={notification.action || props.action}
          dismissAfter={dismissAfter}
          onDismiss={props.onDismiss.bind(this, notification)}
          onRequestClose={onRequestClose.bind(this, notification)}
          notificationStyle={notificationStyle}
        />
      );
    })}
  </div>
);

NotificationStack.propTypes = {
  notifications: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func,
  action: PropTypes.string,
  dismissAfter: PropTypes.number
};

NotificationStack.defaultProps = {
  notificationStyleFactory: getNotificationStyle,
  dismissInOrder: true,
  dismissAfter: 5000
};

export default NotificationStack;
