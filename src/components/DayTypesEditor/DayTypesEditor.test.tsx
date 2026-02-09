import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { MockedResponse } from '@apollo/client/testing';
import { DayTypesEditor } from './DayTypesEditor';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import { createDayType } from 'test/factories';
import DayType from 'model/DayType';

const allDayTypes: DayType[] = [
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
  createDayType({
    id: 'dt-3',
    name: 'Holidays',
    changed: '2024-01-03T00:00:00Z',
  }),
];

const createGetDayTypesMock = (
  dayTypes: DayType[] = allDayTypes,
): MockedResponse => ({
  request: { query: GET_DAY_TYPES },
  result: {
    data: {
      dayTypes: dayTypes.map((dt) => ({
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
});

const renderEditor = (
  dayTypes: DayType[] = [],
  onChange = vi.fn(),
  mocks: MockedResponse[] = [createGetDayTypesMock()],
) => {
  return {
    onChange,
    ...render(
      <MockedProvider mocks={mocks}>
        <DayTypesEditor dayTypes={dayTypes} onChange={onChange} />
      </MockedProvider>,
    ),
  };
};

describe('DayTypesEditor', () => {
  it('renders the autocomplete input', async () => {
    renderEditor();

    await waitFor(() => {
      expect(
        screen.getByLabelText('Choose day types for this service journey'),
      ).toBeInTheDocument();
    });
  });

  it('renders the edit day types button', async () => {
    renderEditor();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /edit day types/i }),
      ).toBeInTheDocument();
    });
  });

  it('shows selected day types as chips in the autocomplete', async () => {
    const selected = [allDayTypes[0]];
    renderEditor(selected);

    await waitFor(() => {
      expect(screen.getByText('Weekdays')).toBeInTheDocument();
    });
  });

  it('disables autocomplete while loading', () => {
    // With no mocks resolved yet, component is in loading state
    renderEditor([], vi.fn(), [
      {
        ...createGetDayTypesMock(),
        delay: 100000, // Very long delay to keep loading state
      },
    ]);

    const autocomplete = screen.getByLabelText(
      'Choose day types for this service journey',
    );
    expect(autocomplete).toBeDisabled();
  });

  it('opens dropdown and shows options when clicked', async () => {
    const user = userEvent.setup();
    renderEditor();

    await waitFor(() => {
      expect(
        screen.getByLabelText('Choose day types for this service journey'),
      ).toBeEnabled();
    });

    const autocomplete = screen.getByLabelText(
      'Choose day types for this service journey',
    );
    await user.click(autocomplete);

    await waitFor(() => {
      expect(screen.getByText('Weekdays')).toBeInTheDocument();
      expect(screen.getByText('Weekends')).toBeInTheDocument();
      expect(screen.getByText('Holidays')).toBeInTheDocument();
    });
  });

  it('calls onChange when a day type is selected from dropdown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderEditor([], onChange);

    await waitFor(() => {
      expect(
        screen.getByLabelText('Choose day types for this service journey'),
      ).toBeEnabled();
    });

    const autocomplete = screen.getByLabelText(
      'Choose day types for this service journey',
    );
    await user.click(autocomplete);

    await waitFor(() => {
      expect(screen.getByText('Weekdays')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Weekdays'));

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'dt-1', name: 'Weekdays' }),
      ]),
    );
  });

  it('opens modal when edit day types button is clicked', async () => {
    const user = userEvent.setup();
    // Use multiple mocks since refetch fires another query
    renderEditor([], vi.fn(), [
      createGetDayTypesMock(),
      createGetDayTypesMock(),
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /edit day types/i }),
      ).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /edit day types/i }));

    await waitFor(() => {
      // The modal dialog should be open — look for the dialog role
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
