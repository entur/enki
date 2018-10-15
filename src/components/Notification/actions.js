export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';

export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/* Values are in ms */
export const NotificationDuration = {
  SHORT: 2000,
  LONG: 5000,
  VERY_LONG: 600000
};

export const showNotification = (title, message, type, duration) => ({
  type: SHOW_NOTIFICATION,
  payload: {
    message,
    title,
    type,
    duration
  }
});

export const showSuccessNotification = (title, message) =>
  showNotification(
    title,
    message,
    NotificationTypes.SUCCESS,
    NotificationDuration.SHORT
  );

export const showErrorNotification = (title, message) =>
  showNotification(
    title,
    message,
    NotificationTypes.ERROR,
    NotificationDuration.VERY_LONG
  );
