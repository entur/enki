import { MockedProvider } from '@apollo/client/testing/react';
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
  screen,
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
    delay: 30,
  },
];

const wait = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
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

const selectableLineAssociations: ExportLineAssociation[] = [
  { lineRef: 'TST:Line:1' },
  { lineRef: 'TST:FlexibleLine:1' },
];

describe('LinesForExport', () => {
  let renderResult: RenderResult;
  let mockedOnChange: Mock<(lines: ExportLineAssociation[]) => void>;
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
    await wait();

    expect(getByText(renderResult.container, 'Test line')).toBeInTheDocument();
    expect(getByText(renderResult.container, 'TST:Line:1')).toBeInTheDocument();
  });

  it('calls onChange with correct lines when selecting/deselecting all', async () => {
    expect(mockedOnChange).toHaveBeenCalledWith([]);

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith(selectableLineAssociations);

    clickCheckbox(renderResult.container, 0);

    expect(mockedOnChange).toHaveBeenCalledWith([]);

    clickCheckbox(renderResult.container, 0);

    expect(mockedOnChange).toHaveBeenCalledWith(selectableLineAssociations);
  });

  it('calls onChange with correct lines when selecting deselecting single checkbox', async () => {
    expect(mockedOnChange).toHaveBeenCalledWith([]);

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith(selectableLineAssociations);

    clickCheckbox(renderResult.container, 1);

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith([
      { lineRef: 'TST:FlexibleLine:1' },
    ]);
  });

  it('does not allow selection of expired lines', async () => {
    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith(selectableLineAssociations);

    const checkboxes = getAllByRole(renderResult.container, 'checkbox');
    const expiredLineCheckbox = checkboxes[2]; // Index 2 should be the expired line

    expect(expiredLineCheckbox).toBeDisabled();

    fireEvent(
      expiredLineCheckbox,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await wait();

    expect(mockedOnChange).toHaveBeenCalledWith(selectableLineAssociations);
  });

  it('sorts by name when clicking Line header', async () => {
    await wait();

    const lineHeader = screen.getByText('Line');
    fireEvent.click(lineHeader);

    const rows = renderResult.container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    // Ascending alphabetical order: "Test flexible line", "Test line", "Test unavailable line"
    expect(
      getByText(rows[0] as HTMLElement, 'Test flexible line'),
    ).toBeInTheDocument();
    expect(getByText(rows[1] as HTMLElement, 'Test line')).toBeInTheDocument();
    expect(
      getByText(rows[2] as HTMLElement, 'Test unavailable line'),
    ).toBeInTheDocument();
  });

  it('toggles sort direction on second click', async () => {
    await wait();

    const lineHeader = screen.getByText('Line');
    fireEvent.click(lineHeader); // asc
    fireEvent.click(lineHeader); // desc

    const rows = renderResult.container.querySelectorAll('tbody tr');
    // Descending order: "Test unavailable line", "Test line", "Test flexible line"
    expect(
      getByText(rows[0] as HTMLElement, 'Test unavailable line'),
    ).toBeInTheDocument();
    expect(
      getByText(rows[2] as HTMLElement, 'Test flexible line'),
    ).toBeInTheDocument();
  });

  it('shows indeterminate checkbox when some lines are deselected', async () => {
    await wait();

    // Deselect one selectable line
    clickCheckbox(renderResult.container, 1);

    const allCheckbox = getAllByRole(renderResult.container, 'checkbox')[0];
    expect(allCheckbox).toHaveAttribute('data-indeterminate', 'true');
  });
});
