import { renderHook } from '@testing-library/react';
import { usePreparedDayTypes } from './usePreparedDayTypes';
import DayType from 'model/DayType';

const makeDayType = (id: string, changed: string, name: string): DayType => ({
  id,
  changed,
  name,
  daysOfWeek: [],
  dayTypeAssignments: [],
});

describe('usePreparedDayTypes', () => {
  const dayTypes: DayType[] = [
    makeDayType('dt1', '2025-01-10T10:00:00Z', 'Oldest'),
    makeDayType('dt2', '2025-03-15T10:00:00Z', 'Newest'),
    makeDayType('dt3', '2025-02-01T10:00:00Z', 'Middle'),
  ];

  it('sorts day types by changed date descending (newest first)', () => {
    const { result } = renderHook(() => usePreparedDayTypes(dayTypes, 1, 10));
    expect(result.current.map((dt) => dt.name)).toEqual([
      'Newest',
      'Middle',
      'Oldest',
    ]);
  });

  it('paginates to the first page with given results per page', () => {
    const { result } = renderHook(() => usePreparedDayTypes(dayTypes, 1, 2));
    expect(result.current).toHaveLength(2);
    expect(result.current[0].name).toBe('Newest');
    expect(result.current[1].name).toBe('Middle');
  });

  it('paginates to the second page', () => {
    const { result } = renderHook(() => usePreparedDayTypes(dayTypes, 2, 2));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Oldest');
  });

  it('returns empty array when page is beyond available data', () => {
    const { result } = renderHook(() => usePreparedDayTypes(dayTypes, 3, 2));
    expect(result.current).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    const { result } = renderHook(() => usePreparedDayTypes([], 1, 10));
    expect(result.current).toHaveLength(0);
  });

  it('handles single item', () => {
    const single = [makeDayType('dt1', '2025-01-01T00:00:00Z', 'Only')];
    const { result } = renderHook(() => usePreparedDayTypes(single, 1, 10));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Only');
  });

  it('does not mutate the original array', () => {
    const original = [...dayTypes];
    renderHook(() => usePreparedDayTypes(dayTypes, 1, 10));
    expect(dayTypes).toEqual(original);
  });
});
