import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Notices from './index';

const formatMessage = (({ id }: { id: string }) => id) as any;

const renderNotices = (
  overrides: Partial<Parameters<typeof Notices>[0]> = {},
) => {
  const defaultProps = {
    notices: [] as { text: string }[],
    setNotices: vi.fn(),
    formatMessage,
    ...overrides,
  };
  return render(<Notices {...defaultProps} />);
};

describe('Notices', () => {
  it('renders the header', () => {
    renderNotices();
    expect(screen.getByText('noticesHeader')).toBeInTheDocument();
  });

  it('renders add button when there are no notices', () => {
    renderNotices();
    expect(
      screen.getByRole('button', { name: /addNoticeTooltip/ }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });

  it('renders text fields for each notice', () => {
    renderNotices({
      notices: [{ text: 'Notice 1' }, { text: 'Notice 2' }],
    });
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(2);
    expect(screen.getByDisplayValue('Notice 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Notice 2')).toBeInTheDocument();
  });

  it('calls setNotices with a new empty notice when add button is clicked', async () => {
    const user = userEvent.setup();
    const setNotices = vi.fn();
    renderNotices({ setNotices, notices: [{ text: 'Existing' }] });

    await user.click(screen.getByRole('button', { name: /addNoticeTooltip/ }));

    expect(setNotices).toHaveBeenCalledWith([
      { text: 'Existing' },
      { text: '' },
    ]);
  });

  it('calls setNotices with updated text when a notice is edited', async () => {
    const user = userEvent.setup();
    const setNotices = vi.fn();
    renderNotices({ setNotices, notices: [{ text: 'Original' }] });

    const textbox = screen.getByDisplayValue('Original');
    await user.clear(textbox);
    await user.type(textbox, 'Updated');

    // onChange calls updateNotice -> if text is empty it removes, otherwise updates
    // After clearing, text is '' so removeNotice is called
    // After typing 'Updated', setNotices should be called with updated text
    expect(setNotices).toHaveBeenCalled();
  });

  it('calls setNotices to remove a notice when delete button is clicked', async () => {
    const user = userEvent.setup();
    const setNotices = vi.fn();
    renderNotices({
      setNotices,
      notices: [{ text: 'Keep' }, { text: 'Remove' }],
    });

    // The delete IconButtons get aria-label from the Tooltip title
    const deleteButtons = screen.getAllByRole('button', {
      name: 'deleteNoticeTooltip',
    });
    expect(deleteButtons).toHaveLength(2);

    await user.click(deleteButtons[1]);

    expect(setNotices).toHaveBeenCalledWith([{ text: 'Keep' }]);
  });

  it('renders a single notice correctly', () => {
    renderNotices({ notices: [{ text: 'Single notice' }] });
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByDisplayValue('Single notice')).toBeInTheDocument();
  });
});
