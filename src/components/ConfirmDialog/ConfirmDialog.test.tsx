import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './index';
import { Button } from '@mui/material';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete item',
    message: 'Are you sure you want to delete?',
    onDismiss: vi.fn(),
  };

  it('renders title and message when open', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Delete item')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete?'),
    ).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Delete item')).not.toBeInTheDocument();
  });

  it('renders custom buttons', () => {
    const buttons = [
      <Button key="cancel">Cancel</Button>,
      <Button key="confirm">Confirm</Button>,
    ];
    render(<ConfirmDialog {...defaultProps} buttons={buttons} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onDismiss when backdrop is clicked', async () => {
    const onDismiss = vi.fn();
    render(<ConfirmDialog {...defaultProps} onDismiss={onDismiss} />);
    const backdrop = document.querySelector('.MuiBackdrop-root');
    await userEvent.click(backdrop!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders with no buttons by default', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
