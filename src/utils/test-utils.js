import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { intlReducer as intl } from 'react-intl-redux';
import thunk from 'redux-thunk';
import { getIntl } from 'i18n';
import reducers from '../reducers';
import { geti18n } from 'i18n';

const { locale, messages } = geti18n();
const middlewares = [thunk.withExtraArgument({ intl: getIntl })];
const enhancer = applyMiddleware(...middlewares);

const combinedReducers = combineReducers({
  ...reducers,
  intl,
});

function render(
  ui,
  {
    initialState = {
      intl: {
        locale,
        messages,
      },
      user: {},
    },
    store = createStore(combinedReducers, initialState, enhancer),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
