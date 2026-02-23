import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, createLine } from 'utils/test-utils';
import Line from 'model/Line';

const mockNavigate = vi.fn();
let mockMatchResult: { params: { id?: string } } | null = null;

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useMatch: () => mockMatchResult,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate-redirect">{to}</div>
    ),
  };
});

const mockMutateLine = vi.fn().mockResolvedValue({});
const mockDeleteLine = vi.fn().mockResolvedValue({});

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>(
    '@apollo/client/react',
  );
  return {
    ...actual,
    useMutation: () => [mockMutateLine, { error: undefined }],
  };
});

let mockLine: Line | undefined;
let mockLoading = false;
let mockNotFound = false;
const mockSetLine = vi.fn();
const mockRefetchLine = vi.fn();

vi.mock('./hooks', () => ({
  useLine: () => ({
    line: mockLine,
    setLine: mockSetLine,
    refetchLine: mockRefetchLine,
    loading: mockLoading,
    error: undefined,
    networks: [{ id: 'TST:Network:1', name: 'Test Network' }],
    brandings: [],
    notFound: mockNotFound,
  }),
  useUttuErrors: vi.fn(),
}));

vi.mock('./LineEditorSteps', () => ({
  default: (props: any) => (
    <div data-testid="line-editor-steps">Step {props.activeStep}</div>
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

const testLine = createLine({
  id: 'TST:Line:1',
  name: 'Test Line 42',
});

const basePreloadedState = {
  organisations: [
    {
      id: 'TST:Authority:1',
      name: 'Test Authority',
      types: { AUTHORITY: true },
    },
  ] as any,
  editor: { isSaved: true } as any,
};

const loadEditor = async () => {
  const mod = await import('./index');
  return mod.default;
};

describe('LineEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLine = testLine;
    mockLoading = false;
    mockNotFound = false;
    mockMatchResult = null;
  });

  describe('loading state', () => {
    it('renders loading indicator when line is loading', async () => {
      mockLoading = true;
      mockLine = undefined;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByText(/loading line/i)).toBeInTheDocument();
    });

    it('renders loading when line is undefined', async () => {
      mockLoading = false;
      mockLine = undefined;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByText(/loading line/i)).toBeInTheDocument();
    });

    it('does not render stepper when loading', async () => {
      mockLoading = true;
      mockLine = undefined;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(
        screen.queryByTestId('line-editor-stepper'),
      ).not.toBeInTheDocument();
    });
  });

  describe('loaded state — create mode', () => {
    it('renders stepper when loaded', async () => {
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByTestId('line-editor-stepper')).toBeInTheDocument();
    });

    it('renders editor steps inside stepper', async () => {
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByTestId('line-editor-steps')).toBeInTheDocument();
    });

    it('shows back button for lines', async () => {
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByText('Lines')).toBeInTheDocument();
    });
  });

  describe('loaded state — edit mode', () => {
    it('renders stepper when editing existing line', async () => {
      mockMatchResult = { params: { id: 'TST:Line:1' } };
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByTestId('line-editor-stepper')).toBeInTheDocument();
    });
  });

  describe('not found', () => {
    it('renders redirect when line is not found', async () => {
      mockNotFound = true;
      const Editor = await loadEditor();
      render(<Editor />, { preloadedState: basePreloadedState });
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();
    });
  });
});
