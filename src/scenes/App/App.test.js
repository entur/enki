import React from 'react';
import { render } from 'utils/test-utils';
import { geti18n } from 'i18n';

const { locale, messages } = geti18n();

import App from './';
it('renders without crashing', () => {
  render(<App />, {
    initialState: {
      intl: {
        locale,
        messages,
      },
      user: {},
    },
  });
});
