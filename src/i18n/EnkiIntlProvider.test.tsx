import { EnkiIntlProvider } from './EnkiIntlProvider';
import { useIntl } from 'react-intl';
import { ConfigContext } from '../config/ConfigContext';
import { Provider } from 'react-redux';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import { store } from '../utils/test-utils';

afterEach(() => {
  cleanup();
});

const TestComponent = () => {
  const { formatMessage } = useIntl();
  return (
    <h1 data-testid="EnkiIntlProviderTest">
      {formatMessage({ id: 'appLoadingMessage' })}
    </h1>
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

    await screen.findByTestId('EnkiIntlProviderTest');
    expect(screen.getByTestId('EnkiIntlProviderTest')).toHaveTextContent(
      'Loading providers and organisations...',
    );
  });
});
