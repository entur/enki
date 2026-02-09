import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { EntityEditorActions } from './EntityEditorActions';

describe('EntityEditorActions', () => {
  const defaultProps = {
    isEditing: true,
    isDeleteDisabled: false,
    onDeleteClick: vi.fn(),
    onSaveClick: vi.fn(),
    isDeleteDialogOpen: false,
    onDeleteDialogClose: vi.fn(),
    onDeleteConfirm: vi.fn(),
    entityName: 'networksHeaderText',
    deleteConfirmTitleId: 'editorDeleteNetworkConfirmDialogTitle',
    deleteConfirmMessageId: 'editorDeleteNetworkConfirmDialogMessage',
    deleteConfirmCancelId: 'editorDeleteNetworkConfirmDialogCancelText',
    deleteConfirmConfirmId: 'editorDeleteNetworkConfirmDialogConfirmText',
  };

  it('renders save and delete buttons when editing', () => {
    render(<EntityEditorActions {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('hides delete button when not editing', () => {
    render(<EntityEditorActions {...defaultProps} isEditing={false} />);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('shows create button text when not editing', () => {
    render(<EntityEditorActions {...defaultProps} isEditing={false} />);
    // The create button uses the entityName translation key
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('disables delete button when isDeleteDisabled is true', () => {
    render(<EntityEditorActions {...defaultProps} isDeleteDisabled={true} />);
    expect(screen.getByText('Delete')).toBeDisabled();
  });

  it('calls onDeleteClick when delete button is clicked', async () => {
    const onDeleteClick = vi.fn();
    render(
      <EntityEditorActions {...defaultProps} onDeleteClick={onDeleteClick} />,
    );
    await userEvent.click(screen.getByText('Delete'));
    expect(onDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('calls onSaveClick when save button is clicked', async () => {
    const onSaveClick = vi.fn();
    render(<EntityEditorActions {...defaultProps} onSaveClick={onSaveClick} />);
    await userEvent.click(screen.getByText('Save'));
    expect(onSaveClick).toHaveBeenCalledTimes(1);
  });

  it('renders confirm dialog when isDeleteDialogOpen is true', () => {
    render(<EntityEditorActions {...defaultProps} isDeleteDialogOpen={true} />);
    expect(
      screen.getByText('Are you sure you want to delete this network?'),
    ).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('calls onDeleteDialogClose when cancel in dialog is clicked', async () => {
    const onDeleteDialogClose = vi.fn();
    render(
      <EntityEditorActions
        {...defaultProps}
        isDeleteDialogOpen={true}
        onDeleteDialogClose={onDeleteDialogClose}
      />,
    );
    await userEvent.click(screen.getByText('No'));
    expect(onDeleteDialogClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDeleteConfirm when confirm in dialog is clicked', async () => {
    const onDeleteConfirm = vi.fn();
    render(
      <EntityEditorActions
        {...defaultProps}
        isDeleteDialogOpen={true}
        onDeleteConfirm={onDeleteConfirm}
      />,
    );
    await userEvent.click(screen.getByText('Yes'));
    expect(onDeleteConfirm).toHaveBeenCalledTimes(1);
  });
});
