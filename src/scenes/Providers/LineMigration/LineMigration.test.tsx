import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from 'utils/test-utils';

const mockNavigate = vi.fn();
let mockParams: Record<string, string> = { providerId: 'TST' };

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

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('../../../actions/providers', () => ({
  getProviders: () => ({ type: 'NOOP' }),
}));

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { profile: { name: 'Test User' } },
    getAccessToken: vi.fn().mockResolvedValue('mock-token'),
  }),
  hasAuthParams: () => false,
}));

import { UttuQuery } from 'api';
import LineMigration from './index';

const mockedUttuQuery = vi.mocked(UttuQuery);

const mockProviders = [
  {
    name: 'Test provider',
    code: 'TST',
    codespace: { xmlns: 'TST', xmlnsUrl: 'http://www.rutebanken.org/ns/tst' },
  },
  {
    name: 'Ruter Flex',
    code: 'RUT',
    codespace: { xmlns: 'RUT', xmlnsUrl: 'http://www.rutebanken.org/ns/rut' },
  },
  {
    name: 'AtB Flex',
    code: 'ATB',
    codespace: { xmlns: 'ATB', xmlnsUrl: 'http://www.rutebanken.org/ns/atb' },
  },
];

const mockLines = [
  {
    id: 'line-1',
    name: 'Line Alpha',
    publicCode: '100',
    privateCode: null,
    operatorRef: 'op-1',
  },
  {
    id: 'line-2',
    name: 'Line Beta',
    publicCode: null,
    privateCode: 'PRI-2',
    operatorRef: 'op-2',
  },
  {
    id: 'line-3',
    name: 'Line Gamma',
    publicCode: null,
    privateCode: null,
    operatorRef: 'op-3',
  },
];

const mockNetworks = [
  {
    id: 'net-1',
    name: 'Network One',
    privateCode: 'N1',
    authorityRef: 'auth-1',
  },
  {
    id: 'net-2',
    name: 'Network Two',
    privateCode: null,
    authorityRef: 'auth-2',
  },
];

const preloadedState = {
  providers: {
    providers: mockProviders as any,
    failure: false,
    exports: null,
  },
  auth: {
    loaded: true,
    isLoading: false,
    isAuthenticated: true,
    getAccessToken: () => Promise.resolve('fake-token'),
    logout: () => Promise.resolve(),
    login: () => Promise.resolve(),
  } as any,
  config: {
    loaded: true,
    uttuApiUrl: 'https://mock-api',
  } as any,
};

const configValue = {
  uttuApiUrl: 'https://mock-api',
  disableAuthentication: true,
};

const renderOpts = {
  preloadedState,
  config: configValue,
  routerProps: { initialEntries: ['/providers/TST/line-migration'] },
};

describe('LineMigration', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockedUttuQuery.mockReset();
    mockParams = { providerId: 'TST' };
  });

  describe('happy path rendering', () => {
    it('renders the form when data loads successfully', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByText(/Migrate Line from Test provider/),
        ).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Source Line')).toBeInTheDocument();
      expect(screen.getByLabelText('Target Provider')).toBeInTheDocument();
      expect(screen.getByLabelText('Target Network')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Conflict Resolution Strategy'),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Include Day Types in migration'),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Dry run (preview only)'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /migrate line/i }),
      ).toBeInTheDocument();
    });

    it('renders provider description text', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByText(/Select a line from Test provider \(TST\)/),
        ).toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    it('shows error message when lines fail to load', async () => {
      mockedUttuQuery.mockRejectedValueOnce(new Error('Network error'));

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByText('Error loading data. Please try again.'),
        ).toBeInTheDocument();
      });

      // The form fields should not be rendered
      expect(screen.queryByLabelText('Source Line')).not.toBeInTheDocument();
    });
  });

  describe('cancel button', () => {
    it('navigates to /providers when Cancel is clicked', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /cancel/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/providers');
    });
  });

  describe('migrate button state', () => {
    it('is disabled when form is not valid (no fields selected)', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /migrate line/i }),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByRole('button', { name: /migrate line/i }),
      ).toBeDisabled();
    });

    it('is enabled when all required fields are filled', async () => {
      // First call: loadLines
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });

      const user = userEvent.setup();
      render(<LineMigration />, renderOpts);

      // Wait for lines to load
      await waitFor(() => {
        expect(screen.getByLabelText('Source Line')).toBeInTheDocument();
      });

      // Select a source line
      const sourceLineInput = screen.getByLabelText('Source Line');
      await user.click(sourceLineInput);
      await waitFor(() => {
        expect(screen.getByText('Line Alpha (100)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Line Alpha (100)'));

      // Select target provider — this triggers loadNetworks
      mockedUttuQuery.mockResolvedValueOnce({ networks: mockNetworks });
      const targetProviderInput = screen.getByLabelText('Target Provider');
      await user.click(targetProviderInput);
      await waitFor(() => {
        expect(screen.getByText('Ruter Flex (RUT)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Ruter Flex (RUT)'));

      // Wait for networks to load, then select a target network
      await waitFor(() => {
        expect(screen.getByLabelText('Target Network')).not.toBeDisabled();
      });
      const targetNetworkInput = screen.getByLabelText('Target Network');
      await user.click(targetNetworkInput);
      await waitFor(() => {
        expect(screen.getByText('Network One (N1)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Network One (N1)'));

      // Now the migrate button should be enabled
      expect(
        screen.getByRole('button', { name: /migrate line/i }),
      ).toBeEnabled();
    });
  });

  describe('dry run', () => {
    it('changes button text to "Preview Migration" when dry run is checked', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByLabelText('Dry run (preview only)'),
        ).toBeInTheDocument();
      });

      // Initially shows "Migrate Line"
      expect(
        screen.getByRole('button', { name: /migrate line/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /preview migration/i }),
      ).not.toBeInTheDocument();

      // Check the dry run checkbox
      await user.click(screen.getByLabelText('Dry run (preview only)'));

      // Now shows "Preview Migration"
      expect(
        screen.getByRole('button', { name: /preview migration/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /^migrate line$/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('no networks message', () => {
    it('shows "No networks found" when provider selected but no networks', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(screen.getByLabelText('Target Provider')).toBeInTheDocument();
      });

      // Select a target provider that has no networks
      mockedUttuQuery.mockResolvedValueOnce({ networks: [] });
      const targetProviderInput = screen.getByLabelText('Target Provider');
      await user.click(targetProviderInput);
      await waitFor(() => {
        expect(screen.getByText('Ruter Flex (RUT)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Ruter Flex (RUT)'));

      await waitFor(() => {
        expect(
          screen.getByText('No networks found for the selected provider.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('migration success', () => {
    it('shows migration success result with summary', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(screen.getByLabelText('Source Line')).toBeInTheDocument();
      });

      // Fill the form
      await user.click(screen.getByLabelText('Source Line'));
      await waitFor(() => {
        expect(screen.getByText('Line Alpha (100)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Line Alpha (100)'));

      mockedUttuQuery.mockResolvedValueOnce({ networks: mockNetworks });
      await user.click(screen.getByLabelText('Target Provider'));
      await waitFor(() => {
        expect(screen.getByText('Ruter Flex (RUT)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Ruter Flex (RUT)'));

      await waitFor(() => {
        expect(screen.getByLabelText('Target Network')).not.toBeDisabled();
      });
      await user.click(screen.getByLabelText('Target Network'));
      await waitFor(() => {
        expect(screen.getByText('Network One (N1)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Network One (N1)'));

      // Mock the migration response
      mockedUttuQuery.mockResolvedValueOnce({
        migrateLine: {
          success: true,
          migratedLineId: 'new-line-id-123',
          summary: {
            entitiesMigrated: 42,
            warningsCount: 0,
            executionTimeMs: 1500,
          },
          warnings: [],
        },
      });

      // Click migrate
      await user.click(screen.getByRole('button', { name: /migrate line/i }));

      await waitFor(() => {
        expect(screen.getByText('Migration Result')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Migration completed successfully!'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('New line ID: new-line-id-123'),
      ).toBeInTheDocument();
      expect(screen.getByText('Entities migrated: 42')).toBeInTheDocument();
      expect(screen.getByText('Warnings: 0')).toBeInTheDocument();
      expect(screen.getByText(/Execution time: 1500/)).toBeInTheDocument();
    });
  });

  describe('migration failure', () => {
    it('shows migration failure result with warnings', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(screen.getByLabelText('Source Line')).toBeInTheDocument();
      });

      // Fill the form
      await user.click(screen.getByLabelText('Source Line'));
      await waitFor(() => {
        expect(screen.getByText('Line Alpha (100)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Line Alpha (100)'));

      mockedUttuQuery.mockResolvedValueOnce({ networks: mockNetworks });
      await user.click(screen.getByLabelText('Target Provider'));
      await waitFor(() => {
        expect(screen.getByText('Ruter Flex (RUT)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Ruter Flex (RUT)'));

      await waitFor(() => {
        expect(screen.getByLabelText('Target Network')).not.toBeDisabled();
      });
      await user.click(screen.getByLabelText('Target Network'));
      await waitFor(() => {
        expect(screen.getByText('Network One (N1)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Network One (N1)'));

      // Mock a failed migration response
      mockedUttuQuery.mockResolvedValueOnce({
        migrateLine: {
          success: false,
          warnings: [
            {
              type: 'CONFLICT',
              message: 'Entity already exists',
              entityId: 'ent-1',
            },
            { type: 'VALIDATION', message: 'Invalid reference' },
          ],
        },
      });

      await user.click(screen.getByRole('button', { name: /migrate line/i }));

      await waitFor(() => {
        expect(screen.getByText('Migration Result')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Migration failed. Please check the warnings below.'),
      ).toBeInTheDocument();
      expect(screen.getByText('Warnings')).toBeInTheDocument();
      expect(
        screen.getByText(/CONFLICT: Entity already exists \(Entity: ent-1\)/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/VALIDATION: Invalid reference/),
      ).toBeInTheDocument();
    });
  });

  describe('migration API error', () => {
    it('shows error result when migration API call throws', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(screen.getByLabelText('Source Line')).toBeInTheDocument();
      });

      // Fill the form
      await user.click(screen.getByLabelText('Source Line'));
      await waitFor(() => {
        expect(screen.getByText('Line Alpha (100)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Line Alpha (100)'));

      mockedUttuQuery.mockResolvedValueOnce({ networks: mockNetworks });
      await user.click(screen.getByLabelText('Target Provider'));
      await waitFor(() => {
        expect(screen.getByText('Ruter Flex (RUT)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Ruter Flex (RUT)'));

      await waitFor(() => {
        expect(screen.getByLabelText('Target Network')).not.toBeDisabled();
      });
      await user.click(screen.getByLabelText('Target Network'));
      await waitFor(() => {
        expect(screen.getByText('Network One (N1)')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Network One (N1)'));

      // Mock the migration to throw an error
      mockedUttuQuery.mockRejectedValueOnce(new Error('Server error'));

      await user.click(screen.getByRole('button', { name: /migrate line/i }));

      await waitFor(() => {
        expect(screen.getByText('Migration Result')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Migration failed. Please check the warnings below.'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/ERROR: Migration failed. Please try again./),
      ).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('include day types checkbox', () => {
    it('is checked by default', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByLabelText('Include Day Types in migration'),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByLabelText('Include Day Types in migration'),
      ).toBeChecked();
    });

    it('can be unchecked', async () => {
      mockedUttuQuery.mockResolvedValueOnce({ lines: mockLines });
      const user = userEvent.setup();

      render(<LineMigration />, renderOpts);

      await waitFor(() => {
        expect(
          screen.getByLabelText('Include Day Types in migration'),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Include Day Types in migration'));
      expect(
        screen.getByLabelText('Include Day Types in migration'),
      ).not.toBeChecked();
    });
  });
});
