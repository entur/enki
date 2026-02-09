import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  cleanup,
  render,
  renderHook,
  fireEvent,
  getAllByRole,
  getByText,
  screen,
  waitFor,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach } from 'vitest';
import intlSlice from '../i18n/intlSlice';
import { messages } from '../i18n/translations/en';
import reducers from '../reducers';
import { TestIntlProvider } from './TestIntlProvider';
import userContextSlice from '../auth/userContextSlice';
import authSlice from '../auth/authSlice';
import configSlice from '../config/configSlice';
import { ConfigContext } from '../config/ConfigContext';
import { Config } from '../config/config';
import { ReactElement } from 'react';

afterEach(() => {
  cleanup();
});

const testReducer = combineReducers({
  ...reducers,
  userContext: userContextSlice,
  intl: intlSlice,
  auth: authSlice,
  config: configSlice,
});

export type TestRootState = ReturnType<typeof testReducer>;

export function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: testReducer,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });
}

// Backward-compatible default store for tests that import it directly
export const store = createTestStore();

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<TestRootState>;
  routerProps?: { initialEntries?: string[] };
  config?: Config;
}

function createWrapper({
  preloadedState,
  routerProps,
  config,
}: Pick<ExtendedRenderOptions, 'preloadedState' | 'routerProps' | 'config'>) {
  const testStore = preloadedState ? createTestStore(preloadedState) : store;

  return function Wrapper({ children }: { children: React.ReactNode }) {
    let wrapped = (
      <Provider store={testStore}>
        <TestIntlProvider locale="en" messages={messages}>
          {children}
        </TestIntlProvider>
      </Provider>
    );

    if (config) {
      wrapped = (
        <ConfigContext.Provider value={config}>
          {wrapped}
        </ConfigContext.Provider>
      );
    }

    if (routerProps) {
      wrapped = (
        <MemoryRouter initialEntries={routerProps.initialEntries}>
          {wrapped}
        </MemoryRouter>
      );
    }

    return wrapped;
  };
}

function customRender(
  ui: ReactElement,
  options: ExtendedRenderOptions = {},
): RenderResult {
  const { preloadedState, routerProps, config, ...renderOptions } = options;
  return render(ui, {
    wrapper: createWrapper({ preloadedState, routerProps, config }),
    ...renderOptions,
  });
}

function customRenderHook<Result, Props>(
  hook: (props: Props) => Result,
  options: ExtendedRenderOptions = {},
) {
  const { preloadedState, routerProps, config, ...renderOptions } = options;
  return renderHook(hook, {
    wrapper: createWrapper({ preloadedState, routerProps, config }),
    ...renderOptions,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
export { customRenderHook as renderHookWithProviders };

export { fireEvent, getAllByRole, getByText, screen, waitFor };

// Re-export test data factories for convenient access
export * from 'test/factories';
