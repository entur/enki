import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import NewServiceJourneyDialog from './NewServiceJourneyDialog';
import JourneyPattern from 'model/JourneyPattern';

describe('NewServiceJourneyDialog', () => {
  const journeyPatterns: JourneyPattern[] = [
    {
      name: 'Route Alpha',
      pointsInSequence: [{ key: 'sp-1', quayRef: 'NSR:Quay:1' }],
      serviceJourneys: [{ id: 'sj-1', passingTimes: [] }],
    },
    {
      name: 'Route Beta',
      pointsInSequence: [{ key: 'sp-2', quayRef: 'NSR:Quay:2' }],
      serviceJourneys: [{ id: 'sj-2', passingTimes: [] }],
    },
  ];

  const defaultProps = {
    open: true,
    setOpen: vi.fn(),
    journeyPatterns,
    keys: ['key-0', 'key-1'],
    selectedJourneyPatternIndex: 0,
    setSelectedJourneyPatternIndex: vi.fn(),
    addNewServiceJourney: vi.fn(),
  };

  it('renders dialog with title and subtitle', () => {
    render(<NewServiceJourneyDialog {...defaultProps} />);
    expect(screen.getByText('New service journey')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Enter a name, choose a journey pattern and press Create',
      ),
    ).toBeInTheDocument();
  });

  it('renders name input and journey pattern selector', () => {
    render(<NewServiceJourneyDialog {...defaultProps} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose journey pattern')).toBeInTheDocument();
  });

  it('shows the selected journey pattern', () => {
    render(<NewServiceJourneyDialog {...defaultProps} />);
    expect(screen.getByDisplayValue('Route Alpha')).toBeInTheDocument();
  });

  it('calls addNewServiceJourney with name and pattern data on Create', async () => {
    const addNewServiceJourney = vi.fn();
    render(
      <NewServiceJourneyDialog
        {...defaultProps}
        addNewServiceJourney={addNewServiceJourney}
      />,
    );
    const nameInput = screen.getByLabelText('Name');
    await userEvent.type(nameInput, 'Weekend Route');
    await userEvent.click(screen.getByText('Create'));
    expect(addNewServiceJourney).toHaveBeenCalledWith(
      'Weekend Route',
      journeyPatterns[0].serviceJourneys,
      journeyPatterns[0].pointsInSequence,
      0,
    );
  });

  it('calls setOpen(false) when Cancel is clicked', async () => {
    const setOpen = vi.fn();
    render(<NewServiceJourneyDialog {...defaultProps} setOpen={setOpen} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('does not render when closed', () => {
    render(<NewServiceJourneyDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('New service journey')).not.toBeInTheDocument();
  });
});
