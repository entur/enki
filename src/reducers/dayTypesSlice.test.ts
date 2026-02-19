import { createDayType } from 'test/factories';
import DayType from 'model/DayType';
import reducer, { receiveDayTypes, receiveDayType } from './dayTypesSlice';

describe('dayTypesSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('receiveDayTypes replaces entire state', () => {
    const dayTypes = [
      createDayType({ id: '1', name: 'Weekdays' }),
      createDayType({ id: '2', name: 'Weekends' }),
    ];
    expect(reducer(null, receiveDayTypes(dayTypes))).toEqual(dayTypes);
  });

  it('receiveDayTypes overwrites existing state', () => {
    const initial = [createDayType({ id: '1', name: 'Old' })];
    const next = [createDayType({ id: '2', name: 'New' })];
    expect(reducer(initial, receiveDayTypes(next))).toEqual(next);
  });

  it('receiveDayType updates existing by id', () => {
    const initial: DayType[] = [
      createDayType({ id: '1', name: 'Old' }),
      createDayType({ id: '2', name: 'Keep' }),
    ];
    const updated = createDayType({ id: '1', name: 'Updated' });
    const result = reducer(initial, receiveDayType(updated));
    expect(result![0].name).toBe('Updated');
    expect(result![1].name).toBe('Keep');
  });

  it('receiveDayType returns singleton when state is null', () => {
    const dt = createDayType({ id: '1', name: 'New' });
    expect(reducer(null, receiveDayType(dt))).toEqual([dt]);
  });

  it('receiveDayType appends when id is not found', () => {
    const initial: DayType[] = [createDayType({ id: '1', name: 'Existing' })];
    const newDt = createDayType({ id: '2', name: 'Appended' });
    const result = reducer(initial, receiveDayType(newDt));
    expect(result).toHaveLength(2);
    expect(result![0].name).toBe('Existing');
    expect(result![1].name).toBe('Appended');
  });
});
