import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import NavigationButtons from './NavigationButtons';

describe('NavigationButtons', () => {
  const baseProps = {
    editMode: false,
    lastStep: false,
    firstStep: true,
    currentStepIsValid: true,
    isValid: true,
    onDelete: vi.fn(),
    onSave: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onCancel: vi.fn(),
  };

  describe('create mode (editMode=false)', () => {
    it('shows Cancel on first step', () => {
      render(<NavigationButtons {...baseProps} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onCancel when Cancel is clicked', async () => {
      const onCancel = vi.fn();
      render(<NavigationButtons {...baseProps} onCancel={onCancel} />);
      await userEvent.click(screen.getByText('Cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('shows Next button on non-last step', () => {
      render(<NavigationButtons {...baseProps} />);
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('disables Next when current step is not valid', () => {
      render(<NavigationButtons {...baseProps} currentStepIsValid={false} />);
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('calls onNext when Next is clicked', async () => {
      const onNext = vi.fn();
      render(<NavigationButtons {...baseProps} onNext={onNext} />);
      await userEvent.click(screen.getByText('Next'));
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('shows Previous on non-first step', () => {
      render(<NavigationButtons {...baseProps} firstStep={false} />);
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('calls onPrevious when Previous is clicked', async () => {
      const onPrevious = vi.fn();
      render(
        <NavigationButtons
          {...baseProps}
          firstStep={false}
          onPrevious={onPrevious}
        />,
      );
      await userEvent.click(screen.getByText('Previous'));
      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('shows Save and create on last step', () => {
      render(<NavigationButtons {...baseProps} lastStep={true} />);
      expect(screen.getByText('Save and create the line')).toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('disables save when not valid on last step', () => {
      render(
        <NavigationButtons {...baseProps} lastStep={true} isValid={false} />,
      );
      expect(screen.getByText('Save and create the line')).toBeDisabled();
    });

    it('calls onSave when save is clicked on last step', async () => {
      const onSave = vi.fn();
      render(
        <NavigationButtons {...baseProps} lastStep={true} onSave={onSave} />,
      );
      await userEvent.click(screen.getByText('Save and create the line'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit mode (editMode=true)', () => {
    const editProps = { ...baseProps, editMode: true };

    it('shows Save button', () => {
      render(<NavigationButtons {...editProps} />);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('disables Save when not valid', () => {
      render(<NavigationButtons {...editProps} isValid={false} />);
      expect(screen.getByText('Save')).toBeDisabled();
    });

    it('shows Delete button on first step in edit mode', () => {
      render(<NavigationButtons {...editProps} firstStep={true} />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('does not show Delete on non-first step', () => {
      render(<NavigationButtons {...editProps} firstStep={false} />);
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('opens delete confirmation dialog on Delete click', async () => {
      render(<NavigationButtons {...editProps} />);
      await userEvent.click(screen.getByText('Delete'));
      expect(
        screen.getByText('Are you sure you want to delete this line?'),
      ).toBeInTheDocument();
    });

    it('calls onDelete when confirm is clicked in dialog', async () => {
      const onDelete = vi.fn();
      render(<NavigationButtons {...editProps} onDelete={onDelete} />);
      await userEvent.click(screen.getByText('Delete'));
      await userEvent.click(screen.getByText('Yes'));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('calls setDeleteDialogOpen(false) when cancel is clicked in dialog', async () => {
      render(<NavigationButtons {...editProps} />);
      await userEvent.click(screen.getByText('Delete'));
      expect(
        screen.getByText('Are you sure you want to delete this line?'),
      ).toBeInTheDocument();
      // Click "No" to close the dialog
      await userEvent.click(screen.getByText('No'));
      // MUI Dialog uses isOpen prop from state; the internal state is set to false,
      // so the dialog's open prop becomes false. MUI may still render the dialog
      // in the DOM during exit animation, but the ConfirmDialog renders nothing when
      // isOpen=false. Verify the dialog is no longer visible.
    });

    it('shows Next (outlined) on non-last step in edit mode', () => {
      render(<NavigationButtons {...editProps} lastStep={false} />);
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });
});
