import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import intlSlice from 'features/app/intlSlice';
import { EnkiIntlProvider } from 'i18n/EnkiIntlProvider';
import { Provider } from 'react-redux';
import reducers from '../reducers';

function render(
  ui,
  {
    store = configureStore({
      reducer: {
        ...reducers,
        intl: intlSlice,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immmutableCheck: false,
          serializableCheck: false,
        }),
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <EnkiIntlProvider>{children}</EnkiIntlProvider>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
