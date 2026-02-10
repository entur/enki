import { describe, it, expect } from 'vitest';
import { render, screen } from 'utils/test-utils';
import Loading from './index';

describe('Loading', () => {
  it('shows loading indicator and text when isLoading is true', () => {
    render(
      <Loading isLoading={true} text="Please wait...">
        <div>Content</div>
      </Loading>,
    );

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders children element when isLoading is false', () => {
    render(
      <Loading isLoading={false} text="Loading...">
        <div>Content</div>
      </Loading>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders children function when isLoading is false', () => {
    render(
      <Loading isLoading={false} text="Loading...">
        {() => <div>Function content</div>}
      </Loading>,
    );

    expect(screen.getByText('Function content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('defaults isLoading to true', () => {
    render(
      <Loading text="Loading...">
        <div>Content</div>
      </Loading>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders full-screen overlay when isFullScreen is true', () => {
    const { container } = render(
      <Loading isLoading={true} isFullScreen={true} text="Full screen loading">
        <div>Content</div>
      </Loading>,
    );

    expect(screen.getByText('Full screen loading')).toBeInTheDocument();
    // Full screen mode uses fixed positioning
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ position: 'fixed' });
  });

  it('renders inline loading when isFullScreen is false', () => {
    const { container } = render(
      <Loading isLoading={true} isFullScreen={false} text="Inline loading">
        <div>Content</div>
      </Loading>,
    );

    expect(screen.getByText('Inline loading')).toBeInTheDocument();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ display: 'flex', flexDirection: 'column' });
  });

  it('returns null children when isLoading is false and children is null', () => {
    const { container } = render(
      <Loading isLoading={false} text="Loading...">
        {null}
      </Loading>,
    );

    expect(container.innerHTML).toBe('');
  });
});
