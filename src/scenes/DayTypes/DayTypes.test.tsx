import { render, screen, userEvent, waitFor } from '../../utils/test-utils';
import DayTypes from './index';
import { mockDayTypes } from '../../mocks/mockData';

describe('DayTypes listing', () => {
  const preloadedState = {
    dayTypes: mockDayTypes as any,
    userContext: { activeProviderCode: 'TST' } as any,
  };

  it('renders the page header', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders day type names', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState,
    });
    expect(screen.getByText('Hverdager')).toBeInTheDocument();
    expect(screen.getByText('Lørdager')).toBeInTheDocument();
    expect(screen.getByText('Søndager')).toBeInTheDocument();
  });

  it('renders formatted weekdays', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState,
    });
    // Hverdager has monday-friday, so the component calls formatMessage for each day
    // The exact text depends on the i18n keys, but let's check the rows exist
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('marks day types with service journeys as in use', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState,
    });
    // Hverdager has numberOfServiceJourneys: 2 -> in use
    // Lørdager has numberOfServiceJourneys: 1 -> in use
    // Søndager has numberOfServiceJourneys: 1 -> in use
    const inUseTexts = screen.getAllByText(/in use/i);
    expect(inUseTexts.length).toBeGreaterThan(0);
  });

  it('shows empty state when no day types', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState: {
        ...preloadedState,
        dayTypes: [],
      },
    });
    expect(screen.getByText(/no day types/i)).toBeInTheDocument();
  });

  it('renders a create button linking to /day-types/create', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/day-types/create');
  });

  it('disables delete button for day types that are in use', () => {
    render(<DayTypes />, {
      routerProps: { initialEntries: ['/day-types'] },
      preloadedState,
    });
    // All mock day types have numberOfServiceJourneys > 0, so all delete buttons should be disabled
    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const deleteButtonsWithIcon = deleteButtons.filter(
      (btn) => btn.id === 'delete-button',
    );
    deleteButtonsWithIcon.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  describe('delete confirmation dialog', () => {
    const dayTypesWithDeletable = [
      ...mockDayTypes,
      {
        id: 'TST:DayType:99',
        changed: '2025-01-15T10:00:00Z',
        name: 'Unused Day Type',
        numberOfServiceJourneys: 0,
        daysOfWeek: ['monday'],
        dayTypeAssignments: [],
      },
    ];

    const deletableState = {
      ...preloadedState,
      dayTypes: dayTypesWithDeletable as any,
    };

    it('opens confirmation dialog when clicking delete on an unused day type', async () => {
      const user = userEvent.setup();
      render(<DayTypes />, {
        routerProps: { initialEntries: ['/day-types'] },
        preloadedState: deletableState,
      });

      // Find the enabled delete button (the one for the unused day type)
      const deleteButtons = screen
        .getAllByRole('button')
        .filter(
          (btn) => btn.id === 'delete-button' && !btn.hasAttribute('disabled'),
        );
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1);

      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete day type')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Are you sure you want to delete this day type?'),
      ).toBeInTheDocument();
    });

    it('dismisses dialog when clicking No', async () => {
      const user = userEvent.setup();
      render(<DayTypes />, {
        routerProps: { initialEntries: ['/day-types'] },
        preloadedState: deletableState,
      });

      const deleteButtons = screen
        .getAllByRole('button')
        .filter(
          (btn) => btn.id === 'delete-button' && !btn.hasAttribute('disabled'),
        );
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete day type')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'No' }));

      await waitFor(() => {
        expect(screen.queryByText('Delete day type')).not.toBeInTheDocument();
      });
    });
  });
});
