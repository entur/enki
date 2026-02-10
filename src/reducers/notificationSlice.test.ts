import reducer, {
  showNotification,
  NotificationTypes,
  NotificationDuration,
} from './notificationSlice';

describe('notificationSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('showNotification sets the notification with a generated key', () => {
    const result = reducer(
      null,
      showNotification({
        title: 'Test Title',
        message: 'Test message',
        type: NotificationTypes.SUCCESS,
        duration: NotificationDuration.SHORT,
        showModal: false,
      }),
    );

    expect(result).toMatchObject({
      title: 'Test Title',
      message: 'Test message',
      type: NotificationTypes.SUCCESS,
      dismissAfter: NotificationDuration.SHORT,
      showModal: false,
    });
    expect(result!.key).toBeDefined();
    expect(typeof result!.key).toBe('string');
  });

  it('showNotification replaces previous notification', () => {
    const first = reducer(
      null,
      showNotification({
        title: 'First',
        message: 'first',
        type: NotificationTypes.INFO,
        duration: NotificationDuration.LONG,
        showModal: false,
      }),
    );

    const second = reducer(
      first,
      showNotification({
        title: 'Second',
        message: 'second',
        type: NotificationTypes.ERROR,
        duration: NotificationDuration.VERY_LONG,
        showModal: true,
      }),
    );

    expect(second!.title).toBe('Second');
    expect(second!.type).toBe(NotificationTypes.ERROR);
    expect(second!.dismissAfter).toBe(NotificationDuration.VERY_LONG);
    expect(second!.showModal).toBe(true);
  });

  it('each showNotification generates a unique key', () => {
    const payload = {
      title: 'T',
      message: 'm',
      type: NotificationTypes.WARNING,
      duration: NotificationDuration.SHORT,
      showModal: false,
    };

    const first = reducer(null, showNotification(payload));
    const second = reducer(first, showNotification(payload));

    expect(first!.key).not.toBe(second!.key);
  });
});
