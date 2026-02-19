import { describe, it, expect } from 'vitest';
import { render, screen } from 'utils/test-utils';
import Notification from './index';
import { createTestStore } from 'utils/test-utils';
import { Provider } from 'react-redux';
import {
  NotificationTypes,
  NotificationDuration,
  showNotification,
} from 'reducers/notificationSlice';
import { TestIntlProvider } from 'utils/TestIntlProvider';
import { messages } from 'i18n/translations/en';

const renderWithStore = (notificationState: any = null) => {
  const store = createTestStore({
    notification: notificationState,
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <TestIntlProvider locale="en" messages={messages}>
          <Notification />
        </TestIntlProvider>
      </Provider>,
    ),
  };
};

describe('Notification', () => {
  it('renders nothing when there is no notification', () => {
    const { container } = renderWithStore(null);
    // The component renders an empty Box
    expect(container.textContent).toBe('');
  });

  it('renders notification title and message from store', () => {
    renderWithStore({
      key: 'test-1',
      title: 'Success!',
      message: 'Item saved successfully',
      type: NotificationTypes.SUCCESS,
      dismissAfter: NotificationDuration.VERY_LONG,
      showModal: false,
    });
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Item saved successfully')).toBeInTheDocument();
  });

  it('renders error notification', () => {
    renderWithStore({
      key: 'test-2',
      title: 'Error',
      message: 'Something went wrong',
      type: NotificationTypes.ERROR,
      dismissAfter: NotificationDuration.VERY_LONG,
      showModal: false,
    });
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('dispatches notification and renders it', () => {
    const store = createTestStore();
    store.dispatch(
      showNotification({
        title: 'Dispatched',
        message: 'Via action',
        type: NotificationTypes.INFO,
        duration: NotificationDuration.VERY_LONG,
        showModal: false,
      }),
    );
    render(
      <Provider store={store}>
        <TestIntlProvider locale="en" messages={messages}>
          <Notification />
        </TestIntlProvider>
      </Provider>,
    );
    expect(screen.getByText('Dispatched')).toBeInTheDocument();
    expect(screen.getByText('Via action')).toBeInTheDocument();
  });
});
