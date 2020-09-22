import React from 'react';
import { render, act } from 'utils/test-utils';
import { MockedProvider } from '@apollo/client/testing';

import LinesForExport from './';
import { MemoryRouter } from 'react-router-dom';

import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';
import { format, addDays, subDays } from 'date-fns';

const line = {
  id: 'TST:Line:1',
  name: 'Test line',
  journeyPatterns: [
    {
      serviceJourneys: [
        {
          dayTypes: [
            {
              dayTypeAssignments: [
                {
                  operatingPeriod: {
                    fromDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
                    toDate: format(addDays(new Date(), 130), 'yyyy-MM-dd'),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const secondLine = {
  id: 'TST:Line:2',
  name: 'Test unavailable line',
  journeyPatterns: [
    {
      serviceJourneys: [
        {
          dayTypes: [
            {
              dayTypeAssignments: [
                {
                  operatingPeriod: {
                    fromDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
                    toDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const flexibleLine = {
  id: 'TST:FlexibleLine:1',
  name: 'Test flexible line',
  journeyPatterns: [
    {
      serviceJourneys: [
        {
          dayTypes: [
            {
              dayTypeAssignments: [
                {
                  operatingPeriod: {
                    fromDate: format(new Date(), 'yyyy-MM-dd'),
                    toDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const mocks = [
  {
    request: {
      query: GET_LINES_FOR_EXPORT,
    },
    result: {
      data: {
        lines: [line, secondLine],
        flexibleLines: [flexibleLine],
      },
    },
  },
];

it('renders without crashing', async () => {
  render(
    <MockedProvider
      mocks={mocks}
      useTypeName={false}
      defaultOptions={{
        watchQuery: { fetchPolicy: 'no-cache' },
        query: { fetchPolicy: 'no-cache' },
      }}
    >
      <MemoryRouter>
        <LinesForExport
          fromDate={format(new Date(), 'yyyy-MM-dd')}
          toDate={format(addDays(new Date(), 120), 'yyyy-MM-dd')}
          onChange={() => {}}
        />
      </MemoryRouter>
    </MockedProvider>
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
