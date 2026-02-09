import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import BulkDeleteDialog from './BulkDeleteDialog';
import ServiceJourney from 'model/ServiceJourney';

describe('BulkDeleteDialog', () => {
  const serviceJourneys: ServiceJourney[] = [
    {
      id: 'sj-1',
      name: 'Morning Express',
      passingTimes: [
        {
          departureTime: '08:00:00',
          departureDayOffset: 0,
        },
      ],
      dayTypes: [
        {
          id: 'dt-1',
          daysOfWeek: ['monday', 'tuesday'],
          dayTypeAssignments: [
            {
              operatingPeriod: {
                fromDate: '2024-01-01',
                toDate: '2024-12-31',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sj-2',
      name: 'Evening Service',
      passingTimes: [
        {
          departureTime: '18:00:00',
          departureDayOffset: 0,
        },
      ],
      dayTypes: [
        {
          id: 'dt-2',
          daysOfWeek: ['wednesday'],
          dayTypeAssignments: [
            {
              operatingPeriod: {
                fromDate: '2024-06-01',
                toDate: '2024-06-30',
              },
            },
          ],
        },
      ],
    },
  ];

  const defaultProps = {
    open: true,
    dismiss: vi.fn(),
    serviceJourneys,
    journeyPatternIndex: 0,
    onConfirm: vi.fn(),
  };

  it('renders dialog with title and all service journeys', () => {
    render(<BulkDeleteDialog {...defaultProps} />);
    expect(screen.getByText('Bulk delete')).toBeInTheDocument();
    expect(screen.getByText('Morning Express')).toBeInTheDocument();
    expect(screen.getByText('Evening Service')).toBeInTheDocument();
  });

  it('renders departure times and day offsets', () => {
    render(<BulkDeleteDialog {...defaultProps} />);
    expect(screen.getByText('08:00:00')).toBeInTheDocument();
    expect(screen.getByText('18:00:00')).toBeInTheDocument();
  });

  it('has delete button disabled when nothing is selected', () => {
    render(<BulkDeleteDialog {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeDisabled();
  });

  it('enables delete button when a row is selected', async () => {
    render(<BulkDeleteDialog {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is "select all", row checkboxes start at index 1
    await userEvent.click(checkboxes[1]);
    expect(screen.getByText('Delete')).toBeEnabled();
  });

  it('calls onConfirm with selected ids when delete is clicked', async () => {
    const onConfirm = vi.fn();
    render(<BulkDeleteDialog {...defaultProps} onConfirm={onConfirm} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]); // select first SJ
    await userEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledWith(['sj-1'], serviceJourneys, 0);
  });

  it('selects all rows with header checkbox', async () => {
    const onConfirm = vi.fn();
    render(<BulkDeleteDialog {...defaultProps} onConfirm={onConfirm} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]); // select all
    await userEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledWith(
      ['sj-1', 'sj-2'],
      serviceJourneys,
      0,
    );
  });

  it('filters service journeys by name', async () => {
    render(<BulkDeleteDialog {...defaultProps} />);
    const searchInput = screen.getByLabelText('Filter by Name');
    await userEvent.type(searchInput, 'Morning');
    expect(screen.getByText('Morning Express')).toBeInTheDocument();
    expect(screen.queryByText('Evening Service')).not.toBeInTheDocument();
  });

  it('calls dismiss when Cancel is clicked', async () => {
    const dismiss = vi.fn();
    render(<BulkDeleteDialog {...defaultProps} dismiss={dismiss} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render when closed', () => {
    render(<BulkDeleteDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Bulk delete')).not.toBeInTheDocument();
  });
});
