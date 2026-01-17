import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  cleanup,
  render,
  fireEvent,
  getAllByRole,
  getByText,
  screen,
  waitFor,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach } from 'vitest';
import intlSlice from '../i18n/intlSlice';
import { messages } from '../i18n/translations/en';
import reducers from '../reducers';
import { TestIntlProvider } from './TestIntlProvider';
import userContextSlice from '../auth/userContextSlice';
import { ReactElement } from 'react';

afterEach(() => {
  cleanup();
});

export const store = configureStore({
  reducer: combineReducers({
    ...reducers,
    userContext: userContextSlice,
    intl: intlSlice,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immmutableCheck: false,
      serializableCheck: false,
    }),
});

function customRender(
  ui: ReactElement,
  options: RenderOptions = {},
): RenderResult {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => (
      <Provider store={store}>
        <TestIntlProvider locale="en" messages={messages}>
          {children}
        </TestIntlProvider>
      </Provider>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };

export { fireEvent, getAllByRole, getByText, screen, waitFor };

// Re-export test data factories for convenient access
export * from 'test/factories';
