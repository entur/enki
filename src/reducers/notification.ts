import { SHOW_NOTIFICATION } from 'actions/constants';
import {
  NotificationAction,
  NotificationDuration,
  NotificationTypes,
} from 'actions/notification';
import { createUuid } from 'helpers/generators';
import { UnknownAction } from 'redux';

export type Notification = {
  key?: string;
  title: string;
  message: string;
  dismissAfter: NotificationDuration;
  type: NotificationTypes;
  showModal: boolean;
};

export type NotificationState = Notification | null;

const defaultNotification: Notification = {
  title: '',
  message: '',
  dismissAfter: NotificationDuration.LONG,
  type: NotificationTypes.SUCCESS,
  showModal: false,
};

const notificationReducer = (
  state: NotificationState = null,
  action: UnknownAction,
) => {
  switch (action.type) {
    case SHOW_NOTIFICATION: {
      const typedAction = action as NotificationAction;
      return {
        ...defaultNotification,
        title: typedAction.payload.title,
        message: typedAction.payload.message,
        dismissAfter: typedAction.payload.duration,
        type: typedAction.payload.type,
        key: createUuid(),
        showModal: typedAction.payload.showModal,
      };
    }
    default:
      return state;
  }
};

export default notificationReducer;
