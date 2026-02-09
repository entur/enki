import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { createFlexibleLine } from 'test/factories';
import { FlexibleLineType } from 'model/FlexibleLine';
import FlexibleLineEditorSteps from './FlexibleLineEditorSteps';

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
  flexibleLine: createFlexibleLine(),
  changeFlexibleLine: vi.fn(),
  operators: [],
  networks: [],
  brandings: [],
  spoilPristine: false,
});

describe('FlexibleLineEditorSteps', () => {
  it('renders General editor at step 0', () => {
    render(<FlexibleLineEditorSteps {...defaultProps()} activeStep={0} />);
    expect(screen.getByTestId('general-line-editor')).toBeInTheDocument();
    expect(screen.queryByTestId('journey-patterns')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders JourneyPatterns at step 1', () => {
    render(<FlexibleLineEditorSteps {...defaultProps()} activeStep={1} />);
    expect(screen.queryByTestId('general-line-editor')).not.toBeInTheDocument();
    expect(screen.getByTestId('journey-patterns')).toBeInTheDocument();
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders ServiceJourneys at step 2 when journey patterns exist', () => {
    render(<FlexibleLineEditorSteps {...defaultProps()} activeStep={2} />);
    expect(screen.queryByTestId('general-line-editor')).not.toBeInTheDocument();
    expect(screen.queryByTestId('journey-patterns')).not.toBeInTheDocument();
    expect(screen.getByTestId('service-journeys')).toBeInTheDocument();
  });

  it('does not render ServiceJourneys at step 2 when no journey patterns', () => {
    const props = defaultProps();
    props.flexibleLine = createFlexibleLine({ journeyPatterns: [] });
    render(<FlexibleLineEditorSteps {...props} activeStep={2} />);
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders nothing visible for an unknown step', () => {
    const { container } = render(
      <FlexibleLineEditorSteps {...defaultProps()} activeStep={99} />,
    );
    expect(screen.queryByTestId('general-line-editor')).not.toBeInTheDocument();
    expect(screen.queryByTestId('journey-patterns')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-journeys')).not.toBeInTheDocument();
  });

  it('renders JourneyPatternEditor inside JourneyPatterns at step 1', () => {
    render(<FlexibleLineEditorSteps {...defaultProps()} activeStep={1} />);
    expect(screen.getByTestId('journey-pattern-editor')).toBeInTheDocument();
  });

  it('renders ServiceJourneyEditor inside ServiceJourneys at step 2', () => {
    render(<FlexibleLineEditorSteps {...defaultProps()} activeStep={2} />);
    expect(screen.getByTestId('service-journey-editor')).toBeInTheDocument();
  });
});
