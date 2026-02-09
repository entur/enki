import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { MockedResponse } from '@apollo/client/testing';
import { DayTypesModalContent } from './DayTypesModalContent';
import { DELETE_DAY_TYPES } from 'api/uttu/mutations';
import { GET_DAY_TYPES_BY_IDS } from 'api/uttu/queries';
import { createDayType } from 'test/factories';

const createDayTypeByIdsMock = (
  dayTypes: ReturnType<typeof createDayType>[],
): MockedResponse => ({
  request: {
    query: GET_DAY_TYPES_BY_IDS,
    variables: (() => true) as any,
  },
  result: {
    data: {
      dayTypesByIds: dayTypes.map((dt) => ({
        __typename: 'DayType',
        id: dt.id,
        name: dt.name,
        changed: dt.changed || new Date().toISOString(),
        numberOfServiceJourneys: 0,
        daysOfWeek: dt.daysOfWeek,
        dayTypeAssignments: dt.dayTypeAssignments.map((dta) => ({
          __typename: 'DayTypeAssignment',
          isAvailable: dta.isAvailable,
          date: null,
          operatingPeriod: {
            __typename: 'OperatingPeriod',
            fromDate: dta.operatingPeriod.fromDate,
            toDate: dta.operatingPeriod.toDate,
          },
        })),
      })),
    },
  },
  maxUsageCount: Number.MAX_SAFE_INTEGER,
});

const renderComponent = (
  dayTypes: ReturnType<typeof createDayType>[] = [],
  refetchDayTypes = vi.fn(),
  extraMocks: MockedResponse[] = [],
) => {
  const mocks = [createDayTypeByIdsMock(dayTypes), ...extraMocks];

  return render(
    <MockedProvider mocks={mocks}>
      <DayTypesModalContent
        dayTypes={dayTypes}
        refetchDayTypes={refetchDayTypes}
      />
    </MockedProvider>,
  );
};

describe('DayTypesModalContent', () => {
  it('renders add and delete buttons', () => {
    renderComponent();

    expect(
      screen.getByRole('button', { name: /add day type/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete selected/i }),
    ).toBeInTheDocument();
  });

  it('renders the table headers', () => {
    renderComponent();

    expect(screen.getByText('NeTEx ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('In use')).toBeInTheDocument();
  });

  it('renders day types in the table', async () => {
    const dayTypes = [
      createDayType({
        id: 'dt-1',
        name: 'Weekdays',
        changed: '2024-01-01T00:00:00Z',
      }),
      createDayType({
        id: 'dt-2',
        name: 'Weekends',
        changed: '2024-01-02T00:00:00Z',
      }),
    ];
    renderComponent(dayTypes);

    expect(screen.getByText('dt-1')).toBeInTheDocument();
    expect(screen.getByText('Weekdays')).toBeInTheDocument();
    expect(screen.getByText('dt-2')).toBeInTheDocument();
    expect(screen.getByText('Weekends')).toBeInTheDocument();
  });

  it('disables delete button when no day types are selected', () => {
    renderComponent();

    const deleteButton = screen.getByRole('button', {
      name: /delete selected/i,
    });
    expect(deleteButton).toBeDisabled();
  });

  it('enables delete button when a day type is selected', async () => {
    const user = userEvent.setup();
    const dayTypes = [
      createDayType({
        id: 'dt-1',
        name: 'Weekdays',
        changed: '2024-01-01T00:00:00Z',
      }),
    ];
    renderComponent(dayTypes);

    // Find the checkbox for this day type (the row checkbox, not the header)
    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is select-all header, second is the row checkbox
    await user.click(checkboxes[1]);

    const deleteButton = screen.getByRole('button', {
      name: /delete selected/i,
    });
    expect(deleteButton).toBeEnabled();
  });

  it('select-all checkbox selects all day types', async () => {
    const user = userEvent.setup();
    const dayTypes = [
      createDayType({
        id: 'dt-1',
        name: 'Type A',
        changed: '2024-01-01T00:00:00Z',
      }),
      createDayType({
        id: 'dt-2',
        name: 'Type B',
        changed: '2024-01-02T00:00:00Z',
      }),
    ];
    renderComponent(dayTypes);

    // Click the select-all checkbox (first checkbox)
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    // Delete button should now be enabled
    const deleteButton = screen.getByRole('button', {
      name: /delete selected/i,
    });
    expect(deleteButton).toBeEnabled();
  });

  it('deselects all when select-all is clicked twice', async () => {
    const user = userEvent.setup();
    const dayTypes = [
      createDayType({
        id: 'dt-1',
        name: 'Type A',
        changed: '2024-01-01T00:00:00Z',
      }),
    ];
    renderComponent(dayTypes);

    const checkboxes = screen.getAllByRole('checkbox');
    // Click select-all, then click again to deselect
    await user.click(checkboxes[0]);
    await user.click(checkboxes[0]);

    const deleteButton = screen.getByRole('button', {
      name: /delete selected/i,
    });
    expect(deleteButton).toBeDisabled();
  });

  it('renders pagination', () => {
    renderComponent();

    // MUI Pagination renders a nav element
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows pagination with correct page count for many day types', () => {
    // Create 15 day types to get 2 pages (10 per page)
    const dayTypes = Array.from({ length: 15 }, (_, i) =>
      createDayType({
        id: `dt-${i}`,
        name: `Day Type ${i}`,
        changed: new Date(2024, 0, i + 1).toISOString(),
      }),
    );
    renderComponent(dayTypes);

    // Should show page 1 and page 2 buttons
    expect(
      screen.getByRole('button', { name: 'Go to page 2' }),
    ).toBeInTheDocument();
  });

  it('calls deleteDayTypes mutation when delete button is clicked with selected items', async () => {
    const user = userEvent.setup();
    const refetchDayTypes = vi.fn();
    const dayTypes = [
      createDayType({
        id: 'dt-1',
        name: 'To Delete',
        changed: '2024-01-01T00:00:00Z',
      }),
    ];

    const deleteMock: MockedResponse = {
      request: {
        query: DELETE_DAY_TYPES,
        variables: { ids: ['dt-1'] },
      },
      result: {
        data: {
          deleteDayTypes: [{ __typename: 'DayType', id: 'dt-1' }],
        },
      },
    };

    renderComponent(dayTypes, refetchDayTypes, [deleteMock]);

    // Select the day type
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    // Click delete
    const deleteButton = screen.getByRole('button', {
      name: /delete selected/i,
    });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(refetchDayTypes).toHaveBeenCalled();
    });
  });

  it('renders "No name" for day types without a name', () => {
    const dayType = createDayType({
      id: 'dt-noname',
      changed: '2024-01-01T00:00:00Z',
    });
    // Remove the name property to test the fallback
    delete (dayType as any).name;
    renderComponent([dayType]);

    expect(screen.getByText('No name')).toBeInTheDocument();
  });
});
