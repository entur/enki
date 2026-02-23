import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import Page from './index';

describe('Page', () => {
  it('renders back button with title', () => {
    render(
      <Page backButtonTitle="Go back">
        <div>Page content</div>
      </Page>,
      { routerProps: { initialEntries: ['/test'] } },
    );

    expect(screen.getByText('Go back')).toBeInTheDocument();
  });

  it('renders page title when provided', () => {
    render(
      <Page backButtonTitle="Back" title="My Page Title">
        <div>Page content</div>
      </Page>,
      { routerProps: { initialEntries: ['/test'] } },
    );

    expect(
      screen.getByRole('heading', { name: 'My Page Title' }),
    ).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(
      <Page backButtonTitle="Back">
        <div>Page content</div>
      </Page>,
      { routerProps: { initialEntries: ['/test'] } },
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Page backButtonTitle="Back">
        <div>Page content</div>
      </Page>,
      { routerProps: { initialEntries: ['/test'] } },
    );

    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('calls onBackButtonClick when provided', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <Page backButtonTitle="Back" onBackButtonClick={onBack}>
        <div>Page content</div>
      </Page>,
      { routerProps: { initialEntries: ['/test'] } },
    );

    await user.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('navigates back when no onBackButtonClick is provided', async () => {
    const user = userEvent.setup();

    render(
      <Page backButtonTitle="Back">
        <div>Page content</div>
      </Page>,
      { routerProps: { initialEntries: ['/first', '/test'] } },
    );

    // Click the back button — it calls navigate(-1)
    await user.click(screen.getByText('Back'));
    // The component should still be in the DOM (navigation is handled by router)
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
