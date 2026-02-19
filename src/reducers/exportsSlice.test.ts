import { Export } from 'model/Export';
import { createExport } from 'test/factories';
import reducer, {
  requestExports,
  receiveExports,
  receiveExport,
} from './exportsSlice';

describe('exportsSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('requestExports resets state to null', () => {
    const initial: Export[] = [createExport({ id: '1' })];
    expect(reducer(initial, requestExports())).toBeNull();
  });

  it('receiveExports sorts by date descending', () => {
    const exports: Export[] = [
      createExport({ id: '1', name: 'Older', created: '2024-01-01T00:00:00Z' }),
      createExport({ id: '2', name: 'Newer', created: '2024-06-01T00:00:00Z' }),
    ];
    const result = reducer(null, receiveExports(exports));
    expect(result![0].name).toBe('Newer');
    expect(result![1].name).toBe('Older');
  });

  it('receiveExport updates existing by id', () => {
    const initial: Export[] = [
      createExport({ id: '1', name: 'Old' }),
      createExport({ id: '2', name: 'Keep' }),
    ];
    const updated = createExport({ id: '1', name: 'Updated' });
    const result = reducer(initial, receiveExport(updated));
    expect(result![0].name).toBe('Updated');
    expect(result![1].name).toBe('Keep');
  });

  it('receiveExport returns singleton when state is null', () => {
    const exp = createExport({ id: '1', name: 'New' });
    expect(reducer(null, receiveExport(exp))).toEqual([exp]);
  });

  it('receiveExport leaves non-matching items unchanged', () => {
    const initial: Export[] = [createExport({ id: '1', name: 'A' })];
    const other = createExport({ id: '99', name: 'B' });
    const result = reducer(initial, receiveExport(other));
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('A');
  });
});
