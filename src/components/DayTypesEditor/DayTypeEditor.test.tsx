import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DayTypeEditor } from './DayTypeEditor';
import { createDayType } from 'test/factories';
import { DAY_OF_WEEK } from 'model/enums';

const renderDayTypeEditor = (
  props: Partial<Parameters<typeof DayTypeEditor>[0]> = {},
) => {
  const defaultProps = {
    dayType: createDayType(),
    canDelete: true,
    refetchDayTypes: vi.fn(),
    ...props,
  };

  return render(
    <MockedProvider mocks={[]}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DayTypeEditor {...defaultProps} />
      </LocalizationProvider>
    </MockedProvider>,
  );
};

describe('DayTypeEditor', () => {
  it('renders the name text field with the day type name', () => {
    const dayType = createDayType({ name: 'My Weekday' });
    renderDayTypeEditor({ dayType });

    const nameField = screen.getByLabelText('Name');
    expect(nameField).toHaveValue('My Weekday');
  });

  it('renders weekday section heading', () => {
    renderDayTypeEditor();
    expect(screen.getByText('Weekdays for availability')).toBeInTheDocument();
  });

  it('renders date availability section heading', () => {
    renderDayTypeEditor();
    expect(
      screen.getByText('Availability for the service'),
    ).toBeInTheDocument();
  });

  it('renders Save button', () => {
    renderDayTypeEditor();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders Delete button when dayType has an id and canDelete is true', () => {
    const dayType = createDayType({ id: 'dt-1' });
    renderDayTypeEditor({ dayType, canDelete: true });

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('does not render Delete button when dayType has no id', () => {
    const dayType = {
      ...createDayType(),
      id: undefined,
    };
    renderDayTypeEditor({ dayType });

    expect(
      screen.queryByRole('button', { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it('disables Delete button when canDelete is false', () => {
    const dayType = createDayType({ id: 'dt-1' });
    renderDayTypeEditor({ dayType, canDelete: false });

    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('updates name when typing in the name field', async () => {
    const user = userEvent.setup();
    const dayType = createDayType({ name: '' });
    renderDayTypeEditor({ dayType });

    const nameField = screen.getByLabelText('Name');
    await user.type(nameField, 'New Name');

    expect(nameField).toHaveValue('New Name');
  });
});
