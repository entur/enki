import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import JourneyPatterns from './index';
import {
  createJourneyPattern,
  createJourneyPatternWithServiceJourneys,
  resetIdCounters,
} from 'test/factories';
import JourneyPattern from 'model/JourneyPattern';

beforeEach(() => {
  resetIdCounters();
});

describe('JourneyPatterns', () => {
  const renderChildren = vi.fn(
    (
      jp: JourneyPattern,
      _validate: any,
      _update: any,
      _copy?: any,
      _delete?: any,
    ) => <div data-testid={`jp-child-${jp.name}`}>child-{jp.name}</div>,
  );

  const defaultProps = {
    onChange: vi.fn(),
    children: renderChildren,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with a single journey pattern', () => {
    it('renders heading and description text', () => {
      const jp = createJourneyPattern({ name: 'JP Alpha' });
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      expect(screen.getByText('Journey Patterns')).toBeInTheDocument();
    });

    it('renders children directly (no accordion) for single JP', () => {
      const jp = createJourneyPattern({ name: 'JP Solo' });
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      expect(screen.getByTestId('jp-child-JP Solo')).toBeInTheDocument();
      // No accordion expand buttons should be present for single JP
      expect(
        screen.queryByRole('button', { expanded: true }),
      ).not.toBeInTheDocument();
    });

    it('calls children with correct arguments', () => {
      const jp = createJourneyPattern({ name: 'My JP' });
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      expect(renderChildren).toHaveBeenCalledTimes(1);
      const [receivedJp, validateFn, updateFn, copyFn, deleteFn] =
        renderChildren.mock.calls[0];
      expect(receivedJp.name).toBe('My JP');
      expect(typeof validateFn).toBe('function');
      expect(typeof updateFn).toBe('function');
      expect(typeof copyFn).toBe('function');
      // Single JP has no delete callback
      expect(deleteFn).toBeUndefined();
    });
  });

  describe('with multiple journey patterns', () => {
    it('renders accordion for each JP when there are multiple', () => {
      const jp1 = createJourneyPattern({ name: 'Route A' });
      const jp2 = createJourneyPattern({ name: 'Route B' });
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp1, jp2]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      expect(screen.getByText('Route A')).toBeInTheDocument();
      expect(screen.getByText('Route B')).toBeInTheDocument();
    });

    it('renders delete and copy icons for each JP in multi mode', () => {
      const jp1 = createJourneyPattern({ name: 'Route A' });
      const jp2 = createJourneyPattern({ name: 'Route B' });
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp1, jp2]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      // Should have delete and copy tooltips
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      const copyButtons = screen.getAllByTestId('ContentCopyIcon');
      expect(deleteButtons).toHaveLength(2);
      expect(copyButtons).toHaveLength(2);
    });

    it('shows delete confirmation dialog when delete icon is clicked', async () => {
      const jp1 = createJourneyPattern({ name: 'Route A' });
      const jp2 = createJourneyPattern({ name: 'Route B' });
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp1, jp2]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await userEvent.click(deleteButtons[0]);
      expect(screen.getByText('Delete journey pattern')).toBeInTheDocument();
    });

    it('calls onChange to remove JP when delete is confirmed', async () => {
      const onChange = vi.fn();
      const jp1 = createJourneyPattern({ name: 'Route A' });
      const jp2 = createJourneyPattern({ name: 'Route B' });
      render(
        <JourneyPatterns onChange={onChange} journeyPatterns={[jp1, jp2]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await userEvent.click(deleteButtons[0]);
      // Confirm the delete
      const yesButton = screen.getByRole('button', { name: 'Yes' });
      await userEvent.click(yesButton);
      expect(onChange).toHaveBeenCalledTimes(1);
      // Should have removed the first JP
      expect(onChange.mock.calls[0][0]).toHaveLength(1);
      expect(onChange.mock.calls[0][0][0].name).toBe('Route B');
    });

    it('dismisses delete dialog when No is clicked', async () => {
      const onChange = vi.fn();
      const jp1 = createJourneyPattern({ name: 'Route A' });
      const jp2 = createJourneyPattern({ name: 'Route B' });
      render(
        <JourneyPatterns onChange={onChange} journeyPatterns={[jp1, jp2]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await userEvent.click(deleteButtons[0]);
      const noButton = screen.getByRole('button', { name: 'No' });
      await userEvent.click(noButton);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('add journey pattern', () => {
    it('renders the add button', () => {
      const jp = createJourneyPattern();
      render(
        <JourneyPatterns {...defaultProps} journeyPatterns={[jp]}>
          {renderChildren}
        </JourneyPatterns>,
      );
      expect(
        screen.getByText('Create more Journey Patterns'),
      ).toBeInTheDocument();
    });
  });

  describe('update journey pattern', () => {
    it('calls onChange with updated JP when handleUpdate is invoked', () => {
      const onChange = vi.fn();
      const jp = createJourneyPattern({ name: 'Original' });
      render(
        <JourneyPatterns onChange={onChange} journeyPatterns={[jp]}>
          {(jp, _validate, handleUpdate) => (
            <button
              data-testid="update-btn"
              onClick={() => handleUpdate({ ...jp, name: 'Updated' })}
            >
              Update
            </button>
          )}
        </JourneyPatterns>,
      );
      screen.getByTestId('update-btn').click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0][0].name).toBe('Updated');
    });
  });
});
