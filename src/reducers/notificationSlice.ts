import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createUuid } from 'helpers/generators';

export enum NotificationTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/* Values are in ms */
export enum NotificationDuration {
  SHORT = 2000,
  LONG = 5000,
  VERY_LONG = 10000,
}

export interface Notification {
  key?: string;
  title: string;
  message: string;
  dismissAfter: NotificationDuration;
  type: NotificationTypes;
  showModal: boolean;
}

export type NotificationState = Notification | null;

interface ShowNotificationPayload {
  title: string;
  message: string;
  type: NotificationTypes;
  duration: NotificationDuration;
  showModal: boolean;
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: null as NotificationState,
  reducers: {
    showNotification: {
      reducer: (_state, action: PayloadAction<Notification>) => action.payload,
      prepare: (payload: ShowNotificationPayload) => ({
        payload: {
          title: payload.title,
          message: payload.message,
          type: payload.type,
          dismissAfter: payload.duration,
          showModal: payload.showModal,
          key: createUuid(),
        },
      }),
    },
  },
});

export const { showNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
