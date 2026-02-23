import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import CopyDialog from './CopyDialog';
import JourneyPattern from 'model/JourneyPattern';

describe('CopyDialog', () => {
  const journeyPattern: JourneyPattern = {
    name: 'Route A',
    pointsInSequence: [],
    serviceJourneys: [],
  };

  const defaultProps = {
    open: true,
    journeyPattern,
    onSave: vi.fn(),
    onDismiss: vi.fn(),
    validateJourneyPatternName: vi.fn().mockReturnValue({}),
  };

  it('renders dialog with title and pre-filled name', () => {
    render(<CopyDialog {...defaultProps} />);
    expect(screen.getByText('Copy Journey Pattern')).toBeInTheDocument();
    const nameInput = screen.getByLabelText('Name *');
    expect(nameInput).toHaveValue('Route A (copy)');
  });

  it('calls onSave with the name when Create copy is clicked', async () => {
    const onSave = vi.fn();
    render(<CopyDialog {...defaultProps} onSave={onSave} />);
    await userEvent.click(screen.getByText('Create copy'));
    expect(onSave).toHaveBeenCalledWith('Route A (copy)');
  });

  it('calls onDismiss when Cancel is clicked', async () => {
    const onDismiss = vi.fn();
    render(<CopyDialog {...defaultProps} onDismiss={onDismiss} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('disables save button when validation returns errors', async () => {
    const validateFn = vi
      .fn()
      .mockReturnValue({ duplicateName: 'Name already exists' });
    render(
      <CopyDialog {...defaultProps} validateJourneyPatternName={validateFn} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Create copy')).toBeDisabled();
    });
  });

  it('shows duplicate name error message', async () => {
    const validateFn = vi
      .fn()
      .mockReturnValue({ duplicateName: 'Name already exists' });
    render(
      <CopyDialog {...defaultProps} validateJourneyPatternName={validateFn} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Name already exists')).toBeInTheDocument();
    });
  });

  it('shows empty name error when name is cleared', async () => {
    const validateFn = vi
      .fn()
      .mockReturnValue({ emptyName: 'Name is required' });
    render(
      <CopyDialog {...defaultProps} validateJourneyPatternName={validateFn} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('does not render when closed', () => {
    render(<CopyDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Copy Journey Pattern')).not.toBeInTheDocument();
  });
});
