import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, createFlexibleLine } from 'utils/test-utils';

const mockNavigate = vi.fn();
let mockParams: Record<string, string> = {};

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate-redirect">{to}</div>
    ),
  };
});

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/flexible-lines/create',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  };
});

const mockRefetchFlexibleLine = vi.fn();
let mockIsLoadingDependencies = true;

vi.mock('./hooks', () => ({
  useLoadDependencies: () => ({
    isLoadingDependencies: mockIsLoadingDependencies,
    refetchFlexibleLine: mockRefetchFlexibleLine,
  }),
}));

vi.mock('./FlexibleLineEditorSteps', () => ({
  default: (props: any) => (
    <div data-testid="flexible-line-editor-steps">Step {props.activeStep}</div>
  ),
}));

vi.mock('components/LineEditorStepper', () => ({
  default: ({ children, steps, ...props }: any) => (
    <div data-testid="line-editor-stepper">
      {steps.map((s: string, i: number) => (
        <span key={i}>{s}</span>
      ))}
      {children(0)}
      {props.isEdit && <button>Save</button>}
      {!props.isEdit && <button>Cancel</button>}
    </div>
  ),
}));

const mockFlexibleLine = createFlexibleLine({
  id: 'TST:FlexibleLine:1',
  name: 'Test Flex Line',
});

const basePreloadedState = {
  flexibleLines: [mockFlexibleLine] as any,
  organisations: [
    {
      id: 'TST:Authority:1',
      name: 'Test Authority',
      types: { AUTHORITY: true },
    },
  ] as any,
  networks: [{ id: 'TST:Network:1', name: 'Test Network' }] as any,
  brandings: [] as any,
  editor: { isSaved: true } as any,
};

const loadEditor = async () => {
  const mod = await import('./index');
  return mod.default;
};

describe('FlexibleLineEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = {};
    mockIsLoadingDependencies = true;
  });

  describe('loading state', () => {
    it('renders loading indicator when dependencies are loading', async () => {
      mockIsLoadingDependencies = true;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByText(/loading line/i)).toBeInTheDocument();
    });

    it('does not render stepper when loading', async () => {
      mockIsLoadingDependencies = true;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(
        screen.queryByTestId('line-editor-stepper'),
      ).not.toBeInTheDocument();
    });
  });

  describe('loaded state — create mode', () => {
    it('renders stepper with editor steps when loaded', async () => {
      mockIsLoadingDependencies = false;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      await waitFor(() => {
        expect(screen.getByTestId('line-editor-stepper')).toBeInTheDocument();
      });
    });

    it('renders editor steps inside stepper', async () => {
      mockIsLoadingDependencies = false;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      await waitFor(() => {
        expect(
          screen.getByTestId('flexible-line-editor-steps'),
        ).toBeInTheDocument();
      });
    });

    it('shows back button for flexible lines', async () => {
      mockIsLoadingDependencies = false;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      await waitFor(() => {
        expect(screen.getByText('Flexible lines')).toBeInTheDocument();
      });
    });
  });

  describe('loaded state — edit mode', () => {
    it('renders stepper when editing existing line', async () => {
      mockIsLoadingDependencies = false;
      mockParams = { id: 'TST:FlexibleLine:1' };
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      await waitFor(() => {
        expect(screen.getByTestId('line-editor-stepper')).toBeInTheDocument();
      });
    });
  });

  describe('missing line', () => {
    it('redirects when loaded but line not found', async () => {
      mockIsLoadingDependencies = false;
      mockParams = { id: 'TST:FlexibleLine:nonexistent' };
      const Editor = await loadEditor();
      render(<Editor />, {
        preloadedState: {
          ...basePreloadedState,
          flexibleLines: [] as any,
        },
      });
      await waitFor(() => {
        expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();
      });
      expect(
        screen.queryByTestId('line-editor-stepper'),
      ).not.toBeInTheDocument();
    });
  });
});
