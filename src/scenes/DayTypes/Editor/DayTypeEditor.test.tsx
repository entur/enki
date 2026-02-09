import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { mockDayTypes } from 'mocks/mockData';

const mockNavigate = vi.fn();
let mockParams: Record<string, string> = {};

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' } },
    getAccessToken: vi.fn().mockResolvedValue('mock-token'),
  }),
  hasAuthParams: () => false,
}));

const preloadedState = {
  dayTypes: mockDayTypes as any,
};

const loadEditor = async () => {
  const mod = await import('./index');
  return mod.default;
};

const renderWithLocalization = (ui: React.ReactElement, opts?: any) =>
  render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {ui}
    </LocalizationProvider>,
    opts,
  );

describe('DayTypeEditor', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams = {};
  });

  describe('create mode', () => {
    it('renders the create heading', { timeout: 15000 }, async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByRole('heading', { name: /create day type/i }),
      ).toBeInTheDocument();
    });

    it('renders the name field', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByRole('textbox', { name: /^name$/i }),
      ).toBeInTheDocument();
    });

    it('renders the weekday picker section', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByText(/weekdays for availability/i),
      ).toBeInTheDocument();
    });

    it('renders a create button', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByRole('button', { name: /create/i }),
      ).toBeInTheDocument();
    });

    it('does not render a delete button', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.queryByRole('button', { name: /delete/i }),
      ).not.toBeInTheDocument();
    });

    it('renders the availability section', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByText(/availability for the service/i),
      ).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      mockParams = { id: 'TST:DayType:1' };
    });

    it('renders the edit heading', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByRole('heading', { name: /edit day type/i }),
      ).toBeInTheDocument();
    });

    it('renders the day type name in the name field', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(
        'Hverdager',
      );
    });

    it('renders a save button', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('renders a delete button', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(
        screen.getByRole('button', { name: /delete/i }),
      ).toBeInTheDocument();
    });

    it('delete button is disabled when day type has service journeys', async () => {
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, { preloadedState });
      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });

    it('delete button is enabled when day type has no service journeys', async () => {
      const dayTypeNoSJs = {
        ...mockDayTypes[0],
        numberOfServiceJourneys: 0,
      };
      const DayTypeEditor = await loadEditor();
      renderWithLocalization(<DayTypeEditor />, {
        preloadedState: { dayTypes: [dayTypeNoSJs] as any },
      });
      expect(
        screen.getByRole('button', { name: /delete/i }),
      ).not.toBeDisabled();
    });
  });
});
