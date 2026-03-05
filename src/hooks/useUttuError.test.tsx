import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../utils/test-utils';
import { TestIntlProvider } from '../utils/TestIntlProvider';
import { messages } from '../i18n/translations/en';
import useUttuError from './useUttuError';
import { NotificationTypes } from '../reducers/notificationSlice';

function createWrapper() {
  const testStore = createTestStore();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={testStore}>
      <TestIntlProvider locale="en" messages={messages}>
        {children}
      </TestIntlProvider>
    </Provider>
  );
  return { Wrapper, testStore };
}

describe('useUttuError', () => {
  it('does not dispatch notification when error is undefined', () => {
    const { Wrapper, testStore } = createWrapper();
    renderHook(
      () => useUttuError('loadLinesErrorHeader', 'loadLinesErrorMessage'),
      { wrapper: Wrapper },
    );
    expect(testStore.getState().notification).toBeNull();
  });

  it('dispatches error notification when error is provided', () => {
    const { Wrapper, testStore } = createWrapper();
    const error = new Error('Something went wrong');

    renderHook(
      () =>
        useUttuError('loadLinesErrorHeader', 'loadLinesErrorMessage', error),
      { wrapper: Wrapper },
    );

    const notification = testStore.getState().notification;
    expect(notification).not.toBeNull();
    expect(notification?.type).toBe(NotificationTypes.ERROR);
  });

  it('calls callback when error is provided', () => {
    const { Wrapper } = createWrapper();
    const error = new Error('Test error');
    const callback = vi.fn();

    renderHook(
      () =>
        useUttuError(
          'loadLinesErrorHeader',
          'loadLinesErrorMessage',
          error,
          callback,
        ),
      { wrapper: Wrapper },
    );

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when error is undefined', () => {
    const { Wrapper } = createWrapper();
    const callback = vi.fn();

    renderHook(
      () =>
        useUttuError(
          'loadLinesErrorHeader',
          'loadLinesErrorMessage',
          undefined,
          callback,
        ),
      { wrapper: Wrapper },
    );

    expect(callback).not.toHaveBeenCalled();
  });
});
