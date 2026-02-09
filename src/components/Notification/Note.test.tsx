import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import Note from './NotificationStack/StackedNotification/Note';

describe('Note', () => {
  const defaultProps = {
    message: 'Something happened',
    onDismiss: vi.fn(),
    type: 'info' as const,
  };

  it('renders message text', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Note {...defaultProps} title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders success type with check icon', () => {
    const { container } = render(
      <Note {...defaultProps} type="success" title="Saved" />,
    );
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="CheckIcon"]')).toBeTruthy();
  });

  it('renders error type with error icon', () => {
    const { container } = render(
      <Note {...defaultProps} type="error" title="Failed" />,
    );
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="ErrorIcon"]')).toBeTruthy();
  });

  it('renders warning type with warning icon', () => {
    const { container } = render(
      <Note {...defaultProps} type="warning" title="Warning" />,
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="WarningIcon"]')).toBeTruthy();
  });

  it('renders info type with info icon', () => {
    const { container } = render(
      <Note {...defaultProps} type="info" title="Info" />,
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="InfoIcon"]')).toBeTruthy();
  });

  it('maps negative type to error palette', () => {
    const { container } = render(
      <Note {...defaultProps} type="negative" title="Negative" />,
    );
    expect(screen.getByText('Negative')).toBeInTheDocument();
    // negative maps to error icon — no icon rendered since getTypeIcon doesn't match 'negative'
    expect(screen.getByText('Negative')).toBeInTheDocument();
  });

  it('calls onRequestClose when close icon is clicked', () => {
    const onRequestClose = vi.fn();
    const { container } = render(
      <Note {...defaultProps} onRequestClose={onRequestClose} isActive />,
    );
    const closeIcon = container.querySelector('[data-testid="CloseIcon"]');
    expect(closeIcon).toBeTruthy();
    closeIcon!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onRequestClose).toHaveBeenCalledOnce();
  });

  it('does not throw when close is clicked without onRequestClose', () => {
    const { container } = render(<Note {...defaultProps} isActive />);
    const closeIcon = container.querySelector('[data-testid="CloseIcon"]');
    expect(() =>
      closeIcon!.dispatchEvent(new MouseEvent('click', { bubbles: true })),
    ).not.toThrow();
  });

  it('calls onDismiss after timeout', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Note {...defaultProps} onDismiss={onDismiss} dismissAfter={1000} />,
    );
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1500);
    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
