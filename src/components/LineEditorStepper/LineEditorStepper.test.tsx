import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import LineEditorStepper from './index';

const defaultSteps = ['About the line', 'Journey Patterns', 'Service Journeys'];

const createDefaultProps = (
  overrides?: Partial<Parameters<typeof LineEditorStepper>[0]>,
) => ({
  steps: defaultSteps,
  isValidStepIndex: () => true,
  currentStepIsValid: () => true,
  isLineValid: true,
  isEdit: false,
  spoilPristine: false,
  setNextClicked: vi.fn(),
  onDelete: vi.fn(),
  isDeleting: false,
  onSave: vi.fn(),
  isSaving: false,
  isSaved: false,
  redirectTo: '/lines',
  showConfirm: false,
  setShowConfirm: vi.fn(),
  authoritiesMissing: false,
  children: (stepIndex: number) => (
    <div data-testid={`step-content-${stepIndex}`}>
      Step {stepIndex} content
    </div>
  ),
  ...overrides,
});

describe('LineEditorStepper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('step labels', () => {
    it('renders all step labels', () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/edit/123'] },
      });
      expect(screen.getByText('About the line')).toBeInTheDocument();
      expect(screen.getByText('Journey Patterns')).toBeInTheDocument();
      expect(screen.getByText('Service Journeys')).toBeInTheDocument();
    });

    it('renders initial step content (step 0)', () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/edit/123'] },
      });
      expect(screen.getByTestId('step-content-0')).toBeInTheDocument();
      expect(screen.getByText('Step 0 content')).toBeInTheDocument();
    });
  });

  describe('navigation — create mode', () => {
    it('shows Cancel on first step', () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/create'] },
      });
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('navigates to next step when Next is clicked', async () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/create'] },
      });
      await userEvent.click(screen.getByText('Next'));
      expect(screen.getByTestId('step-content-1')).toBeInTheDocument();
      expect(screen.getByText('Step 1 content')).toBeInTheDocument();
    });

    it('navigates back with Previous', async () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/create'] },
      });
      await userEvent.click(screen.getByText('Next'));
      expect(screen.getByTestId('step-content-1')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Previous'));
      expect(screen.getByTestId('step-content-0')).toBeInTheDocument();
    });

    it('disables Next button when current step is invalid', () => {
      const setNextClicked = vi.fn();
      render(
        <LineEditorStepper
          {...createDefaultProps({
            currentStepIsValid: () => false,
            setNextClicked,
          })}
        />,
        { routerProps: { initialEntries: ['/lines/create'] } },
      );
      expect(screen.getByText('Next')).toBeDisabled();
      expect(setNextClicked).not.toHaveBeenCalled();
    });

    it('shows Save and create on last step', async () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/create'] },
      });
      // Navigate to last step
      await userEvent.click(screen.getByText('Next'));
      await userEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Save and create the line')).toBeInTheDocument();
    });

    it('calls onSave when Save button is clicked on last step', async () => {
      const onSave = vi.fn();
      render(<LineEditorStepper {...createDefaultProps({ onSave })} />, {
        routerProps: { initialEntries: ['/lines/create'] },
      });
      await userEvent.click(screen.getByText('Next'));
      await userEvent.click(screen.getByText('Next'));
      await userEvent.click(screen.getByText('Save and create the line'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('navigation — edit mode', () => {
    it('shows Save button in edit mode', () => {
      render(<LineEditorStepper {...createDefaultProps({ isEdit: true })} />, {
        routerProps: { initialEntries: ['/lines/edit/123'] },
      });
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('disables Save when line is not valid', () => {
      render(
        <LineEditorStepper
          {...createDefaultProps({ isEdit: true, isLineValid: false })}
        />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      expect(screen.getByText('Save')).toBeDisabled();
    });

    it('calls onSave when Save is clicked', async () => {
      const onSave = vi.fn();
      render(
        <LineEditorStepper {...createDefaultProps({ isEdit: true, onSave })} />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      await userEvent.click(screen.getByText('Save'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('shows Delete button on first step in edit mode', () => {
      render(<LineEditorStepper {...createDefaultProps({ isEdit: true })} />, {
        routerProps: { initialEntries: ['/lines/edit/123'] },
      });
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls onDelete through confirmation dialog', async () => {
      const onDelete = vi.fn();
      render(
        <LineEditorStepper
          {...createDefaultProps({ isEdit: true, onDelete })}
        />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      await userEvent.click(screen.getByText('Delete'));
      // Confirmation dialog appears
      expect(screen.getByText('Delete line')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Yes'));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('step clicking', () => {
    it('navigates to clicked step when valid', async () => {
      render(<LineEditorStepper {...createDefaultProps()} />, {
        routerProps: { initialEntries: ['/lines/edit/123'] },
      });
      // Click directly on step 2
      await userEvent.click(screen.getByText('Service Journeys'));
      expect(screen.getByTestId('step-content-2')).toBeInTheDocument();
    });

    it('does not navigate when step is not valid', async () => {
      render(
        <LineEditorStepper
          {...createDefaultProps({
            isValidStepIndex: (i: number) => i === 0,
          })}
        />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      await userEvent.click(screen.getByText('Service Journeys'));
      // Should still show step 0
      expect(screen.getByTestId('step-content-0')).toBeInTheDocument();
    });
  });

  describe('error alert', () => {
    it('shows error alert when other steps have errors in edit mode', () => {
      render(
        <LineEditorStepper
          {...createDefaultProps({
            isEdit: true,
            spoilPristine: true,
            currentStepIsValid: (i: number) => i === 0, // only step 0 is valid
          })}
        />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      // On step 0, other steps (1, 2) are invalid — the MUI Alert should appear
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText(/You must fix the errors in the following steps/),
      ).toBeInTheDocument();
    });

    it('does not show error alert when all steps are valid', () => {
      render(
        <LineEditorStepper
          {...createDefaultProps({
            isEdit: true,
            spoilPristine: true,
          })}
        />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('authorities missing dialog', () => {
    it('shows authority missing dialog when authoritiesMissing is true', () => {
      render(
        <LineEditorStepper
          {...createDefaultProps({ authoritiesMissing: true })}
        />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      expect(screen.getByText('Network is missing')).toBeInTheDocument();
      expect(screen.getByText('Home page')).toBeInTheDocument();
    });
  });

  describe('confirm navigation dialog', () => {
    it('renders confirm navigation dialog when showConfirm is true', () => {
      render(
        <LineEditorStepper {...createDefaultProps({ showConfirm: true })} />,
        { routerProps: { initialEntries: ['/lines/edit/123'] } },
      );
      expect(screen.getByText('Unsaved changes!')).toBeInTheDocument();
    });
  });
});
