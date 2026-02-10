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
import LinesForExport, {
  compareExportableLines,
  mapStatusToTextWithUndefined,
  ExportableLine,
} from '.';

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

  it('sorts by status column', async () => {
    await wait();

    const statusHeader = screen.getByText('Status');
    fireEvent.click(statusHeader);

    const rows = renderResult.container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    // Ascending alphabetical: "negative" < "neutral" < "positive"
    // secondLine (negative), flexibleLine (neutral), line (positive)
    expect(
      getByText(rows[0] as HTMLElement, 'Test unavailable line'),
    ).toBeInTheDocument();
    expect(
      getByText(rows[1] as HTMLElement, 'Test flexible line'),
    ).toBeInTheDocument();
    expect(getByText(rows[2] as HTMLElement, 'Test line')).toBeInTheDocument();
  });

  it('sorts by availability (to) column using non-string comparison', async () => {
    await wait();

    const availabilityHeader = screen.getByText('Availability');
    fireEvent.click(availabilityHeader);

    const rows = renderResult.container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    // Ascending by CalendarDate 'to': secondLine (today-10), flexibleLine (today+10), line (today+130)
    expect(
      getByText(rows[0] as HTMLElement, 'Test unavailable line'),
    ).toBeInTheDocument();
    expect(
      getByText(rows[1] as HTMLElement, 'Test flexible line'),
    ).toBeInTheDocument();
    expect(getByText(rows[2] as HTMLElement, 'Test line')).toBeInTheDocument();
  });
});

describe('LinesForExport with empty journey patterns', () => {
  const emptyLine = {
    id: 'TST:Line:3',
    name: 'Empty line',
    journeyPatterns: [],
  };

  const emptyMocks = [
    {
      request: { query: GET_LINES_FOR_EXPORT },
      result: {
        data: {
          lines: [emptyLine],
          flexibleLines: [],
        },
      },
      delay: 30,
    },
  ];

  it('renders line with empty journey patterns as disabled', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <MockedProvider
        mocks={emptyMocks}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <MemoryRouter>
          <LinesForExport onChange={onChange} />
        </MemoryRouter>
      </MockedProvider>,
    );
    await wait();

    expect(getByText(container, 'Empty line')).toBeInTheDocument();
    const checkboxes = getAllByRole(container, 'checkbox');
    // The line checkbox (index 1, after "all" checkbox) should be disabled
    expect(checkboxes[1]).toBeDisabled();
    // onChange should have been called with empty array (no selectable lines)
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

describe('compareExportableLines', () => {
  const makeLine = (overrides: Partial<ExportableLine>): ExportableLine => ({
    id: 'test',
    name: 'Test',
    status: 'positive',
    from: getCurrentDate(),
    to: getCurrentDate(),
    selected: true,
    ...overrides,
  });

  it('returns 0 when both values are null', () => {
    const a = makeLine({ name: undefined as any });
    const b = makeLine({ name: undefined as any });
    expect(compareExportableLines(a, b, 'name', 'asc')).toBe(0);
  });

  it('returns 1 when first value is null', () => {
    const a = makeLine({ name: undefined as any });
    const b = makeLine({ name: 'B' });
    expect(compareExportableLines(a, b, 'name', 'asc')).toBe(1);
  });

  it('returns -1 when second value is null', () => {
    const a = makeLine({ name: 'A' });
    const b = makeLine({ name: undefined as any });
    expect(compareExportableLines(a, b, 'name', 'asc')).toBe(-1);
  });

  it('compares strings ascending', () => {
    const a = makeLine({ name: 'Alpha' });
    const b = makeLine({ name: 'Beta' });
    expect(compareExportableLines(a, b, 'name', 'asc')).toBeLessThan(0);
  });

  it('compares strings descending', () => {
    const a = makeLine({ name: 'Alpha' });
    const b = makeLine({ name: 'Beta' });
    expect(compareExportableLines(a, b, 'name', 'desc')).toBeGreaterThan(0);
  });

  it('compares non-string values (CalendarDate) ascending', () => {
    const a = makeLine({ to: getCurrentDate() });
    const b = makeLine({ to: getCurrentDate().add({ days: 10 }) });
    expect(compareExportableLines(a, b, 'to', 'asc')).toBeLessThan(0);
  });

  it('compares non-string values descending', () => {
    const a = makeLine({ to: getCurrentDate() });
    const b = makeLine({ to: getCurrentDate().add({ days: 10 }) });
    expect(compareExportableLines(a, b, 'to', 'desc')).toBeGreaterThan(0);
  });

  it('returns 0 when non-string values are equal', () => {
    const date = getCurrentDate();
    const a = makeLine({ to: date });
    const b = makeLine({ to: date });
    expect(compareExportableLines(a, b, 'to', 'asc')).toBe(0);
  });
});

describe('mapStatusToTextWithUndefined', () => {
  it('returns "Unknown" for undefined status', () => {
    expect(mapStatusToTextWithUndefined(undefined)).toBe('Unknown');
  });
});
