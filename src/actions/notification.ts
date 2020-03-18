export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';

export enum NotificationTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/* Values are in ms */
export enum NotificationDuration {
  SHORT = 2000,
  LONG = 5000,
  VERY_LONG = 600000
}

export const showNotification = (
  title: string,
  message: string,
  type: NotificationTypes,
  duration: NotificationDuration,
  showModal?: boolean
) => ({
  type: SHOW_NOTIFICATION,
  payload: {
    message,
    title,
    type,
    duration,
    showModal: showModal ?? false
  }
});

export const showSuccessNotification = (
  title: string,
  message: string,
  showModal?: boolean
) =>
  showNotification(
    title,
    message,
    NotificationTypes.SUCCESS,
    NotificationDuration.SHORT,
    showModal
  );

export const showErrorNotification = (title: string, message: string) =>
  showNotification(
    title,
    message,
    NotificationTypes.ERROR,
    NotificationDuration.VERY_LONG
  );
