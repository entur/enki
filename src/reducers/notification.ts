import {
  NotificationDuration,
  NotificationTypes,
  SHOW_NOTIFICATION
} from 'actions/notification';
import { createUuid } from 'helpers/generators';
import { AnyAction } from 'redux';

export type Notification = {
  key?: string;
  title: string;
  message: string;
  dismissAfter: NotificationDuration;
  type: NotificationTypes | null;
};

export type NotificationState = Notification | null;

const defaultNotification: Notification = {
  title: '',
  message: '',
  dismissAfter: NotificationDuration.LONG,
  type: null
};

const notificationReducer = (
  state: NotificationState = null,
  action: AnyAction
) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...defaultNotification,
        title: action.payload.title,
        message: action.payload.message,
        dismissAfter: action.payload.duration,
        type: action.payload.type,
        key: createUuid()
      };
    default:
      return state;
  }
};

export default notificationReducer;
