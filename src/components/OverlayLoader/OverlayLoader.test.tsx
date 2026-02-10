import { describe, it, expect } from 'vitest';
import { render, screen } from 'utils/test-utils';
import OverlayLoader from './index';

describe('OverlayLoader', () => {
  it('renders children', () => {
    render(
      <OverlayLoader isLoading={false}>
        <div>Child content</div>
      </OverlayLoader>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('shows loading indicator and text when isLoading is true', () => {
    render(
      <OverlayLoader isLoading={true} text="Loading data...">
        <div>Child content</div>
      </OverlayLoader>,
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    // Children are still rendered (just behind the overlay)
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('does not show loading overlay when isLoading is false', () => {
    render(
      <OverlayLoader isLoading={false} text="Loading data...">
        <div>Child content</div>
      </OverlayLoader>,
    );

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies seeThrough opacity by default', () => {
    const { container } = render(
      <OverlayLoader isLoading={true}>
        <div>Child content</div>
      </OverlayLoader>,
    );

    // The overlay backdrop is the first child Box inside the wrapper
    const wrapper = container.firstChild as HTMLElement;
    const backdrop = wrapper.children[0] as HTMLElement;
    expect(backdrop).toHaveStyle({ opacity: '0.9' });
  });

  it('applies full opacity when seeThrough is false', () => {
    const { container } = render(
      <OverlayLoader isLoading={true} seeThrough={false}>
        <div>Child content</div>
      </OverlayLoader>,
    );

    const wrapper = container.firstChild as HTMLElement;
    const backdrop = wrapper.children[0] as HTMLElement;
    expect(backdrop).toHaveStyle({ opacity: '1' });
  });
});
