import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DayTypeAssignmentsEditor from './DayTypeAssignmentsEditor';
import DayTypeAssignment from 'model/DayTypeAssignment';

const renderWithDatePicker = (ui: React.ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {ui}
    </LocalizationProvider>,
  );
};

const createAssignment = (
  overrides?: Partial<DayTypeAssignment>,
): DayTypeAssignment => ({
  isAvailable: true,
  operatingPeriod: {
    fromDate: '2025-06-01',
    toDate: '2025-06-30',
  },
  ...overrides,
});

describe('DayTypeAssignmentsEditor', () => {
  it('renders date pickers for each assignment', () => {
    const assignments = [createAssignment()];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    // MUI v8 DatePicker renders a group role with aria-labelledby
    const groups = screen.getAllByRole('group');
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it('renders the "Available" switch', () => {
    const assignments = [createAssignment()];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('calls onChange when adding a new assignment', async () => {
    const user = userEvent.setup();
    const assignments = [createAssignment()];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    const addButton = screen.getByRole('button', { name: /add date/i });
    await user.click(addButton);

    expect(onChange).toHaveBeenCalledTimes(1);
    const newAssignments = onChange.mock.calls[0][0];
    expect(newAssignments).toHaveLength(2);
  });

  it('does not show delete button when there is only one assignment', () => {
    const assignments = [createAssignment()];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('shows delete buttons when there are multiple assignments', () => {
    const assignments = [createAssignment(), createAssignment()];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    // MUI renders Delete icon inside IconButton
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('[data-testid="DeleteIcon"]'));
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onChange when toggling the Available switch', async () => {
    const user = userEvent.setup();
    const assignments = [createAssignment({ isAvailable: true })];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    // MUI Switch renders an input[type=checkbox] inside a span
    const switchInput = document.querySelector('input[type="checkbox"]')!;
    await user.click(switchInput);

    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0][0];
    expect(updated[0].isAvailable).toBe(false);
  });

  it('calls onChange when delete button is clicked', async () => {
    const user = userEvent.setup();
    const assignments = [
      createAssignment({
        operatingPeriod: { fromDate: '2025-01-01', toDate: '2025-06-30' },
      }),
      createAssignment({
        operatingPeriod: { fromDate: '2025-07-01', toDate: '2025-12-31' },
      }),
    ];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('[data-testid="DeleteIcon"]'));
    await user.click(deleteButtons[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const remaining = onChange.mock.calls[0][0];
    expect(remaining).toHaveLength(1);
    // The second assignment should remain
    expect(remaining[0].operatingPeriod.fromDate).toBe('2025-07-01');
  });

  it('renders "Add date" button', () => {
    const assignments = [createAssignment()];
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor
        dayTypeAssignments={assignments}
        onChange={onChange}
      />,
    );

    expect(
      screen.getByRole('button', { name: /add date/i }),
    ).toBeInTheDocument();
  });

  it('auto-adds an assignment when given an empty array', () => {
    const onChange = vi.fn();

    renderWithDatePicker(
      <DayTypeAssignmentsEditor dayTypeAssignments={[]} onChange={onChange} />,
    );

    // When empty, it calls onChange to add a default assignment
    expect(onChange).toHaveBeenCalledTimes(1);
    const newAssignments = onChange.mock.calls[0][0];
    expect(newAssignments).toHaveLength(1);
    expect(newAssignments[0].isAvailable).toBe(true);
  });
});
