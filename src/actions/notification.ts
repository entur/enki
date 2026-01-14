import {
  showNotification,
  NotificationDuration,
  NotificationTypes,
} from '../reducers/notificationSlice';

// Re-export enums and base action
export { NotificationDuration, NotificationTypes, showNotification };

// Helper action creators
export const showSuccessNotification = (
  title: string,
  message: string,
  showModal?: boolean,
) =>
  showNotification({
    title,
    message,
    type: NotificationTypes.SUCCESS,
    duration: NotificationDuration.LONG,
    showModal: showModal ?? false,
  });

export const showErrorNotification = (title: string, message: string) =>
  showNotification({
    title,
    message,
    type: NotificationTypes.ERROR,
    duration: NotificationDuration.VERY_LONG,
    showModal: false,
  });
