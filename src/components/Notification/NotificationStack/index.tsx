import { NotificationDuration } from 'actions/notification';
import { Notification } from 'reducers/notification';
import StackedNotification from './StackedNotification';
import ModalNote from './StackedNotification/Note/ModalNote';

const getTopOffset = (index: number) => ({
  top: `${2 + index * 8}rem`,
});
const DEFAULT_DISMISS_TIME = NotificationDuration.LONG;

type Props = {
  notifications: Notification[];
  onDismiss: (notification: Notification) => void;
  onRequestClose?: (notification: Notification) => void;
};

const NotificationStack = (props: Props) => {
  const { notifications, onDismiss } = props;
  const numberOfNotifications = notifications.length - 1;

  return (
    <div>
      {notifications.map((notification, index) => {
        const isLast = numberOfNotifications === index;
        const topOffset = getTopOffset(index);

        if (notification.showModal) {
          return (
            <ModalNote
              title={notification.title}
              message={notification.message}
              onDismiss={() => onDismiss(notification)}
            />
          );
        }

        let dismissAfter = notification.dismissAfter ?? DEFAULT_DISMISS_TIME;
        if (!isLast) {
          dismissAfter += index * 1000;
        }

        return (
          <StackedNotification
            {...notification}
            key={notification.key}
            dismissAfter={dismissAfter}
            onDismiss={() => onDismiss(notification)}
            topOffset={topOffset}
          />
        );
      })}
    </div>
  );
};

export default NotificationStack;
