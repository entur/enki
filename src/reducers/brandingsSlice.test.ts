import { Branding } from 'model/Branding';
import reducer, { receiveBrandings, receiveBranding } from './brandingsSlice';

describe('brandingsSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('receiveBrandings replaces entire state', () => {
    const brandings: Branding[] = [
      { id: '1', name: 'Brand1' },
      { id: '2', name: 'Brand2' },
    ];
    expect(reducer(null, receiveBrandings(brandings))).toEqual(brandings);
  });

  it('receiveBrandings overwrites existing state', () => {
    const initial: Branding[] = [{ id: '1', name: 'Old' }];
    const next: Branding[] = [{ id: '2', name: 'New' }];
    expect(reducer(initial, receiveBrandings(next))).toEqual(next);
  });

  it('receiveBranding updates existing by id', () => {
    const initial: Branding[] = [
      { id: '1', name: 'Old' },
      { id: '2', name: 'Keep' },
    ];
    const updated: Branding = { id: '1', name: 'New' };
    const result = reducer(initial, receiveBranding(updated));
    expect(result).toEqual([
      { id: '1', name: 'New' },
      { id: '2', name: 'Keep' },
    ]);
  });

  it('receiveBranding returns singleton when state is null', () => {
    const branding: Branding = { id: '1', name: 'New' };
    expect(reducer(null, receiveBranding(branding))).toEqual([branding]);
  });

  it('receiveBranding leaves non-matching items unchanged', () => {
    const initial: Branding[] = [{ id: '1', name: 'A' }];
    const other: Branding = { id: '99', name: 'B' };
    const result = reducer(initial, receiveBranding(other));
    expect(result).toEqual([{ id: '1', name: 'A' }]);
  });
});
