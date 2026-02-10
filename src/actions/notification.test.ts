import { describe, it, expect } from 'vitest';
import { showSuccessNotification, showErrorNotification } from './notification';
import {
  NotificationTypes,
  NotificationDuration,
} from '../reducers/notificationSlice';

describe('notification action creators', () => {
  describe('showSuccessNotification', () => {
    it('creates a success notification action with correct defaults', () => {
      const action = showSuccessNotification('Title', 'Message');
      expect(action.type).toBe('notification/showNotification');
      expect(action.payload).toMatchObject({
        title: 'Title',
        message: 'Message',
        type: NotificationTypes.SUCCESS,
        dismissAfter: NotificationDuration.LONG,
        showModal: false,
      });
      expect(action.payload.key).toBeDefined();
    });

    it('sets showModal when provided', () => {
      const action = showSuccessNotification('Title', 'Msg', true);
      expect(action.payload.showModal).toBe(true);
    });

    it('defaults showModal to false when not provided', () => {
      const action = showSuccessNotification('Title', 'Msg');
      expect(action.payload.showModal).toBe(false);
    });
  });

  describe('showErrorNotification', () => {
    it('creates an error notification action', () => {
      const action = showErrorNotification('Error Title', 'Error Message');
      expect(action.type).toBe('notification/showNotification');
      expect(action.payload).toMatchObject({
        title: 'Error Title',
        message: 'Error Message',
        type: NotificationTypes.ERROR,
        dismissAfter: NotificationDuration.VERY_LONG,
        showModal: false,
      });
      expect(action.payload.key).toBeDefined();
    });
  });
});
