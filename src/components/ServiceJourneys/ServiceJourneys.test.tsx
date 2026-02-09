import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import ServiceJourneys, { sortByDepartureTime } from './index';
import {
  createJourneyPattern,
  createJourneyPatternWithServiceJourneys,
  createServiceJourneyWithPassingTimes,
  resetIdCounters,
} from 'test/factories';
import ServiceJourney from 'model/ServiceJourney';

beforeEach(() => {
  resetIdCounters();
});

describe('sortByDepartureTime', () => {
  const makeSortable = (sj: ServiceJourney, label: string) => ({
    sj,
    render: label,
  });

  it('sorts service journeys ascending by first departure time', () => {
    const sj1 = createServiceJourneyWithPassingTimes(3, 11); // 11:00
    const sj2 = createServiceJourneyWithPassingTimes(3, 8); // 08:00
    const sj3 = createServiceJourneyWithPassingTimes(3, 14); // 14:00

    const sortable = [
      makeSortable(sj1, 'sj1'),
      makeSortable(sj2, 'sj2'),
      makeSortable(sj3, 'sj3'),
    ];

    const sorted = sortByDepartureTime(sortable);
    expect(sorted.map((s) => s.render)).toEqual(['sj2', 'sj1', 'sj3']);
  });

  it('does not mutate the original array', () => {
    const sj1 = createServiceJourneyWithPassingTimes(3, 11);
    const sj2 = createServiceJourneyWithPassingTimes(3, 8);
    const sortable = [makeSortable(sj1, 'sj1'), makeSortable(sj2, 'sj2')];
    const original = [...sortable];
    sortByDepartureTime(sortable);
    expect(sortable).toEqual(original);
  });

  it('handles service journeys with same departure time', () => {
    const sj1 = createServiceJourneyWithPassingTimes(3, 9);
    const sj2 = createServiceJourneyWithPassingTimes(3, 9);
    const sortable = [makeSortable(sj1, 'sj1'), makeSortable(sj2, 'sj2')];
    const sorted = sortByDepartureTime(sortable);
    expect(sorted).toHaveLength(2);
  });

  it('uses earliestDepartureTime when departureTime is missing', () => {
    const sj1: ServiceJourney = {
      id: 'sj-1',
      passingTimes: [
        {
          departureTime: undefined,
          earliestDepartureTime: '10:00:00',
          departureDayOffset: 0,
          earliestDepartureDayOffset: 0,
        },
      ],
    };
    const sj2: ServiceJourney = {
      id: 'sj-2',
      passingTimes: [
        {
          departureTime: '08:00:00',
          departureDayOffset: 0,
        },
      ],
    };
    const sortable = [makeSortable(sj1, 'late'), makeSortable(sj2, 'early')];
    const sorted = sortByDepartureTime(sortable);
    expect(sorted.map((s) => s.render)).toEqual(['early', 'late']);
  });

  it('handles day offsets correctly', () => {
    const sj1: ServiceJourney = {
      id: 'sj-1',
      passingTimes: [
        {
          departureTime: '23:00:00',
          departureDayOffset: 0,
        },
      ],
    };
    const sj2: ServiceJourney = {
      id: 'sj-2',
      passingTimes: [
        {
          departureTime: '01:00:00',
          departureDayOffset: 1,
        },
      ],
    };
    const sortable = [
      makeSortable(sj2, 'next-day'),
      makeSortable(sj1, 'today'),
    ];
    const sorted = sortByDepartureTime(sortable);
    expect(sorted.map((s) => s.render)).toEqual(['today', 'next-day']);
  });

  it('handles single item array', () => {
    const sj = createServiceJourneyWithPassingTimes(3, 9);
    const sortable = [makeSortable(sj, 'only')];
    const sorted = sortByDepartureTime(sortable);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].render).toBe('only');
  });
});

describe('ServiceJourneys component', () => {
  const renderChild = vi.fn((sj: ServiceJourney, _stops: any, _update: any) => (
    <div data-testid={`sj-child-${sj.name}`}>child-{sj.name}</div>
  ));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with single JP and single SJ', () => {
    it('renders heading and description', () => {
      const jp = createJourneyPattern({ name: 'JP1' });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(screen.getByText('Service Journeys')).toBeInTheDocument();
    });

    it('renders children directly (no accordion) for single SJ', () => {
      const jp = createJourneyPattern({
        name: 'JP1',
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'Solo SJ' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(screen.getByTestId('sj-child-Solo SJ')).toBeInTheDocument();
    });

    it('calls children with correct arguments for single SJ', () => {
      const jp = createJourneyPattern({
        name: 'JP1',
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'My SJ' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(renderChild).toHaveBeenCalledTimes(1);
      const [sj, stopPoints, updateFn] = renderChild.mock.calls[0];
      expect(sj.name).toBe('My SJ');
      expect(stopPoints).toEqual(jp.pointsInSequence);
      expect(typeof updateFn).toBe('function');
    });
  });

  describe('with multiple service journeys', () => {
    it('renders accordion for each SJ when there are multiple', () => {
      const jp = createJourneyPattern({
        name: 'JP1',
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'Morning' }),
          createServiceJourneyWithPassingTimes(3, 14, 15, {
            name: 'Afternoon',
          }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(screen.getByText('Morning')).toBeInTheDocument();
      expect(screen.getByText('Afternoon')).toBeInTheDocument();
    });

    it('renders bulk delete button when multiple SJs', () => {
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9),
          createServiceJourneyWithPassingTimes(3, 11),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(screen.getByText('Bulk delete')).toBeInTheDocument();
    });

    it('renders delete icon for each SJ when there are multiple', () => {
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'SJ A' }),
          createServiceJourneyWithPassingTimes(3, 11, 15, { name: 'SJ B' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      expect(deleteIcons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('with multiple journey patterns', () => {
    it('renders JP name as heading when there are multiple JPs', () => {
      const jp1 = createJourneyPatternWithServiceJourneys(2, 3, {
        name: 'Route North',
      });
      const jp2 = createJourneyPatternWithServiceJourneys(2, 3, {
        name: 'Route South',
      });
      render(
        <ServiceJourneys journeyPatterns={[jp1, jp2]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(screen.getByText('Route North')).toBeInTheDocument();
      expect(screen.getByText('Route South')).toBeInTheDocument();
    });
  });

  describe('delete service journey', () => {
    it('shows delete confirmation dialog on delete icon click', async () => {
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'SJ A' }),
          createServiceJourneyWithPassingTimes(3, 11, 15, { name: 'SJ B' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await userEvent.click(deleteButtons[0]);
      expect(screen.getByText('Delete service journey')).toBeInTheDocument();
    });

    it('calls onChange to remove SJ when delete is confirmed', async () => {
      const onChange = vi.fn();
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'SJ A' }),
          createServiceJourneyWithPassingTimes(3, 11, 15, { name: 'SJ B' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={onChange}>
          {renderChild}
        </ServiceJourneys>,
      );
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await userEvent.click(deleteButtons[0]);
      const yesButton = screen.getByRole('button', { name: 'Yes' });
      await userEvent.click(yesButton);
      expect(onChange).toHaveBeenCalledTimes(1);
      const updatedJPs = onChange.mock.calls[0][0];
      expect(updatedJPs[0].serviceJourneys).toHaveLength(1);
    });

    it('dismisses delete dialog when No is clicked', async () => {
      const onChange = vi.fn();
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'SJ A' }),
          createServiceJourneyWithPassingTimes(3, 11, 15, { name: 'SJ B' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={onChange}>
          {renderChild}
        </ServiceJourneys>,
      );
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await userEvent.click(deleteButtons[0]);
      const noButton = screen.getByRole('button', { name: 'No' });
      await userEvent.click(noButton);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('add service journey', () => {
    it('renders the add button', () => {
      const jp = createJourneyPattern();
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={vi.fn()}>
          {renderChild}
        </ServiceJourneys>,
      );
      expect(
        screen.getByText('Create more Service Journeys'),
      ).toBeInTheDocument();
    });
  });

  describe('update service journey', () => {
    it('calls onChange when handleUpdate is invoked', () => {
      const onChange = vi.fn();
      const jp = createJourneyPattern({
        serviceJourneys: [
          createServiceJourneyWithPassingTimes(3, 9, 15, { name: 'Editable' }),
        ],
      });
      render(
        <ServiceJourneys journeyPatterns={[jp]} onChange={onChange}>
          {(sj, _stops, handleUpdate) => (
            <button
              data-testid="update-btn"
              onClick={() => handleUpdate({ ...sj, name: 'Updated' })}
            >
              Update
            </button>
          )}
        </ServiceJourneys>,
      );
      screen.getByTestId('update-btn').click();
      expect(onChange).toHaveBeenCalledTimes(1);
      const updatedJPs = onChange.mock.calls[0][0];
      expect(updatedJPs[0].serviceJourneys[0].name).toBe('Updated');
    });
  });
});
