import React from 'react';
import { render } from 'utils/test-utils';
import { MockedProvider } from '@apollo/client/testing';

import LinesForExport from './';
import { MemoryRouter } from 'react-router-dom';

import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';

const mocks = [
  {
    request: {
      query: GET_LINES_FOR_EXPORT,
    },
    result: {
      data: {
        lines: [],
        flexibleLines: [],
      },
    },
  },
];

it('renders without crashing', () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <LinesForExport onChange={() => {}} />
      </MemoryRouter>
    </MockedProvider>
  );
});
