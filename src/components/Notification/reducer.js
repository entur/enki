import { SHOW_NOTIFICATION } from './actions';
import { createUuid } from '../../helpers/generators';

const initialState = {
  notification: null
};

const defaultNotificationState = {
  title: null,
  message: '',
  dismissAfter: 5000,
  type: null
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...defaultNotificationState,
        title: action.payload.title,
        message: action.payload.message,
        dismissAfter: action.payload.duration,
        type: action.payload.type,
        key: createUuid()
      };
  }
  return state;
};

export default notificationReducer;
