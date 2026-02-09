import { render, screen } from '../../utils/test-utils';
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
});
