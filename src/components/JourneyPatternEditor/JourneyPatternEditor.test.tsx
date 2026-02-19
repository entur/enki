import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import JourneyPatternEditor from './index';
import { createJourneyPattern } from 'test/factories';
import { MockedProvider } from '@apollo/client/testing/react';

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isLoading: false,
    isAuthenticated: true,
    user: { access_token: 'fake' },
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  }),
  hasAuthParams: () => false,
}));

vi.mock('../../api', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    UttuQuery: vi.fn(() => Promise.resolve({ stopPlaces: [] })),
  };
});

vi.mock('@entur/react-component-toggle', () => ({
  ComponentToggle: ({ children }: any) => children,
  useComponentToggleContext: () => ({ getComponent: () => null }),
}));

describe('JourneyPatternEditor', () => {
  const noValidationError = () => ({});

  const defaultProps = {
    journeyPattern: createJourneyPattern({
      name: 'Route A',
      description: 'Main route through city center',
      privateCode: 'JP-A',
    }),
    onSave: vi.fn(),
    spoilPristine: false,
    validateJourneyPatternName: noValidationError,
  };

  const renderEditor = (props = {}) =>
    render(
      <MockedProvider mocks={[]}>
        <JourneyPatternEditor {...defaultProps} {...props} />
      </MockedProvider>,
      {
        config: {
          uttuApiUrl: 'http://localhost:11701/services/flexible-lines',
        },
      },
    );

  it('renders name field with value', () => {
    renderEditor();
    expect(screen.getByLabelText('Name *')).toHaveValue('Route A');
  });

  it('renders description field with value', () => {
    renderEditor();
    expect(screen.getByLabelText('Description')).toHaveValue(
      'Main route through city center',
    );
  });

  it('renders private code field with value', () => {
    renderEditor();
    expect(screen.getByLabelText('Private code')).toHaveValue('JP-A');
  });

  it('calls onSave when name is changed', async () => {
    const onSave = vi.fn();
    renderEditor({ onSave });
    const nameInput = screen.getByLabelText('Name *');
    await userEvent.type(nameInput, 'X');
    expect(onSave).toHaveBeenCalled();
    const lastCall = onSave.mock.calls[onSave.mock.calls.length - 1][0];
    expect(lastCall.name).toBe('Route AX');
  });

  it('renders delete chip when onDelete is provided', () => {
    renderEditor({ onDelete: vi.fn() });
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render delete chip when onDelete is not provided', () => {
    renderEditor();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('renders copy chip when onCopy is provided', () => {
    renderEditor({ onCopy: vi.fn() });
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('does not render copy chip when onCopy is not provided', () => {
    renderEditor();
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  it('renders with empty optional fields', () => {
    const emptyJP = createJourneyPattern({
      name: 'Empty JP',
      description: null,
      privateCode: null,
    });
    renderEditor({ journeyPattern: emptyJP });
    expect(screen.getByLabelText('Name *')).toHaveValue('Empty JP');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByLabelText('Private code')).toHaveValue('');
  });
});
