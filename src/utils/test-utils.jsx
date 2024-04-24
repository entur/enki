import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach } from 'vitest';
import intlSlice from '../i18n/intlSlice';
import { messages } from '../i18n/translations/en';
import reducers from '../reducers';
import { TestIntlProvider } from './TestIntlProvider';

afterEach(() => {
  cleanup();
});

export const store = configureStore({
  reducer: combineReducers({
    ...reducers,
    intl: intlSlice,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immmutableCheck: false,
      serializableCheck: false,
    }),
});

function customRender(ui, options = {}) {
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
