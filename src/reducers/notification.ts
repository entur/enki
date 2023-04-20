import { SHOW_NOTIFICATION } from 'actions/constants';
import { NotificationDuration, NotificationTypes } from 'actions/notification';
import { createUuid } from 'helpers/generators';
import { AnyAction } from 'redux';

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
        key: createUuid(),
        showModal: action.payload.showModal,
      };
    default:
      return state;
  }
};

export default notificationReducer;
