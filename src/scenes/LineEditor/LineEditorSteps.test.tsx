import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { createLine } from 'test/factories';
import LineEditorSteps from './LineEditorSteps';

vi.mock('components/GeneralLineEditor', () => ({
  default: (props: any) => (
    <div data-testid="general-line-editor">General Editor</div>
  ),
}));

vi.mock('components/JourneyPatterns', () => ({
  default: ({ children, journeyPatterns }: any) => (
    <div data-testid="journey-patterns">
      {journeyPatterns.map((_: any, i: number) => (
        <div key={i}>{children(_, vi.fn(), vi.fn(), vi.fn(), vi.fn())}</div>
      ))}
    </div>
  ),
}));

vi.mock('components/JourneyPatternEditor', () => ({
  default: (props: any) => (
    <div data-testid="journey-pattern-editor">JP Editor</div>
  ),
}));

vi.mock('components/ServiceJourneys', () => ({
  default: ({ children, journeyPatterns }: any) => (
    <div data-testid="service-journeys">
      {children({ id: 'sj1' }, [], vi.fn(), vi.fn(), vi.fn())}
    </div>
  ),
}));

vi.mock('components/ServiceJourneyEditor', () => ({
  default: (props: any) => (
    <div data-testid="service-journey-editor">SJ Editor</div>
  ),
}));

const defaultProps = () => ({
  line: createLine(),
  changeLine: vi.fn(),
  operators: [],
  networks: [],
  brandings: [],
  spoilPristine: false,
});

describe('LineEditorSteps', () => {
  it('renders General editor at step 0', () => {
    render(<LineEditorSteps {...defaultProps()} activeStep={0} />);
    expect(screen.getByTestId('general-line-editor')).toBeInTheDocument();
    expect(screen.queryByTestId('journey-patterns')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders JourneyPatterns at step 1', () => {
    render(<LineEditorSteps {...defaultProps()} activeStep={1} />);
    expect(screen.queryByTestId('general-line-editor')).not.toBeInTheDocument();
    expect(screen.getByTestId('journey-patterns')).toBeInTheDocument();
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders ServiceJourneys at step 2 when journey patterns exist', () => {
    render(<LineEditorSteps {...defaultProps()} activeStep={2} />);
    expect(screen.queryByTestId('general-line-editor')).not.toBeInTheDocument();
    expect(screen.queryByTestId('journey-patterns')).not.toBeInTheDocument();
    expect(screen.getByTestId('service-journeys')).toBeInTheDocument();
  });

  it('does not render ServiceJourneys at step 2 when no journey patterns', () => {
    const props = defaultProps();
    props.line = createLine({ journeyPatterns: [] });
    render(<LineEditorSteps {...props} activeStep={2} />);
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders nothing visible for an unknown step', () => {
    render(<LineEditorSteps {...defaultProps()} activeStep={99} />);
    expect(screen.queryByTestId('general-line-editor')).not.toBeInTheDocument();
    expect(screen.queryByTestId('journey-patterns')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders JourneyPatternEditor inside JourneyPatterns at step 1', () => {
    render(<LineEditorSteps {...defaultProps()} activeStep={1} />);
    expect(screen.getByTestId('journey-pattern-editor')).toBeInTheDocument();
  });

  it('renders ServiceJourneyEditor inside ServiceJourneys at step 2', () => {
    render(<LineEditorSteps {...defaultProps()} activeStep={2} />);
    expect(screen.getByTestId('service-journey-editor')).toBeInTheDocument();
  });
});
