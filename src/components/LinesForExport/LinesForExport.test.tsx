import { MockedProvider } from '@apollo/client/testing';
import { getCurrentDate } from '../../utils/dates';
import { MemoryRouter } from 'react-router-dom';

import { GET_LINES_FOR_EXPORT } from 'api/uttu/queries';
import { ExportLineAssociation } from 'model/Export';
import {
  RenderResult,
  act,
  fireEvent,
  getAllByRole,
  getByText,
  render,
} from 'utils/test-utils';
import LinesForExport from '.';

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { Mock } from 'vitest';

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
                    fromDate: getCurrentDate().add({ days: 10 }).toString(),
                    toDate: getCurrentDate().add({ days: 130 }).toString(),
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
                    fromDate: getCurrentDate()
                      .subtract({ days: 30 })
                      .toString(),
                    toDate: getCurrentDate().subtract({ days: 10 }).toString(),
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
                    fromDate: getCurrentDate().toString(),
                    toDate: getCurrentDate().add({ days: 10 }).toString(),
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

const wait = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1));
  });
};

const clickCheckbox = (container: HTMLElement, index: number) => {
  fireEvent(
    getAllByRole(container, 'checkbox')[index],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

const lineAssociations: ExportLineAssociation[] = [
  { lineRef: 'TST:Line:1' },
  { lineRef: 'TST:Line:2' },
  { lineRef: 'TST:FlexibleLine:1' },
];

describe('LinesForExport', () => {
  let renderResult: RenderResult;
  let mockedOnChange: Mock<any>;
  beforeEach(() => {
    mockedOnChange = vi.fn();
    renderResult = render(
      <MockedProvider
        mocks={mocks}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <MemoryRouter>
          <LinesForExport onChange={mockedOnChange} />
        </MemoryRouter>
      </MockedProvider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  // TODO This does not work with vitest
  it('renders without crashing', async () => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    expect(getByText(renderResult.container, 'Test line')).toBeInTheDocument();
    expect(getByText(renderResult.container, 'TST:Line:1')).toBeInTheDocument();
  });

  it('calls onChange with correct lines when selecting/deselecting all', async () => {
    expect(mockedOnChange).toHaveBeenCalledWith([]);

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith(lineAssociations);

    clickCheckbox(renderResult.container, 0);

    expect(mockedOnChange).toHaveBeenCalledWith([]);

    clickCheckbox(renderResult.container, 0);

    expect(mockedOnChange).toHaveBeenCalledWith(lineAssociations);
  });

  it('calls onChange with correct lines when selecting deselecting single checkbox', async () => {
    expect(mockedOnChange).toHaveBeenCalledWith([]);

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith(lineAssociations);

    clickCheckbox(renderResult.container, 1);

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith([]);
  });
});
