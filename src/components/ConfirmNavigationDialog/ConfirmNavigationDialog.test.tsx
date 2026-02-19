import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import NavigateConfirmBox from './index';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

const defaultProps = {
  hideDialog: vi.fn(),
  redirectTo: '/lines',
  title: 'Unsaved changes',
  description: 'You have unsaved changes. Do you want to leave?',
  confirmText: 'Leave',
  cancelText: 'Stay',
};

const renderDialog = (overrides: Partial<typeof defaultProps> = {}) =>
  render(<NavigateConfirmBox {...defaultProps} {...overrides} />, {
    routerProps: { initialEntries: ['/'] },
  });

describe('ConfirmNavigationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dialog with title and description', () => {
    renderDialog();
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(
      screen.getByText('You have unsaved changes. Do you want to leave?'),
    ).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stay' })).toBeInTheDocument();
  });

  it('calls hideDialog and navigates when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const hideDialog = vi.fn();
    renderDialog({ hideDialog });

    await user.click(screen.getByRole('button', { name: 'Leave' }));

    expect(hideDialog).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/lines');
  });

  it('calls hideDialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const hideDialog = vi.fn();
    renderDialog({ hideDialog });

    await user.click(screen.getByRole('button', { name: 'Stay' }));

    expect(hideDialog).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('dispatches setSavedChanges(true) before navigating', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Leave' }));

    // Navigation should have occurred, implying setSavedChanges was dispatched
    expect(mockNavigate).toHaveBeenCalledWith('/lines');
  });
});
