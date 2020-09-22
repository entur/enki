import React from 'react';
import { render } from 'utils/test-utils';

import App from './';
it('renders without crashing', () => {
  render(<App />);
});
