import { EnkiIntlProvider } from './EnkiIntlProvider';
import { useIntl } from 'react-intl';
import { ConfigContext } from '../config/ConfigContext';
import { Provider } from 'react-redux';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';
import { store } from '../utils/test-utils';
import { useAppDispatch } from '../store/hooks';
import { updateLocale } from './intlSlice';

afterEach(() => {
  cleanup();
});

const TestComponent = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  return (
    <>
      <h1 data-testid="TestComponentHeader">
        {formatMessage({ id: 'appLoadingMessage' })}
      </h1>
      <button
        data-testid="TestComponentChangeLocaleButton"
        onClick={() => dispatch(updateLocale('nb'))}
      >
        Change locale
      </button>
    </>
  );
};

describe('EnkiIntlProvider', () => {
  it('should render components with correct translations', async () => {
    render(
      <ConfigContext.Provider value={{ defaultLocale: 'en' }}>
        <Provider store={store}>
          <EnkiIntlProvider>
            <TestComponent />
          </EnkiIntlProvider>
        </Provider>
      </ConfigContext.Provider>,
    );

    await screen.findByTestId('TestComponentHeader');

    expect(screen.getByTestId('TestComponentHeader')).toHaveTextContent(
      'Loading providers and organisations...',
    );

    act(() => {
      userEvent.click(screen.getByTestId('TestComponentChangeLocaleButton'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('TestComponentHeader')).toHaveTextContent(
        'Laster inn dataleverandører og organisasjoner...',
      );
    });
  });
});
