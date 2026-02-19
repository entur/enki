import reducer, {
  setActiveProviderCode,
  setActiveMapBaseLayer,
} from './userContextSlice';

describe('userContextSlice', () => {
  it('should return initial state with defaults', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.isAdmin).toBe(false);
    expect(state.preferredName).toBe('');
    expect(state.providers).toEqual([]);
    expect(state.loaded).toBe(false);
  });

  it('setActiveProviderCode updates the active provider', () => {
    const state = reducer(undefined, { type: 'unknown' });
    const result = reducer(state, setActiveProviderCode('RUT'));
    expect(result.activeProviderCode).toBe('RUT');
  });

  it('setActiveProviderCode can be set to null', () => {
    const state = reducer(undefined, setActiveProviderCode('RUT'));
    const result = reducer(state, setActiveProviderCode(null));
    expect(result.activeProviderCode).toBeNull();
  });

  it('setActiveMapBaseLayer updates the base layer', () => {
    const state = reducer(undefined, { type: 'unknown' });
    const result = reducer(state, setActiveMapBaseLayer('satellite'));
    expect(result.activeMapBaseLayer).toBe('satellite');
  });

  it('setActiveMapBaseLayer preserves other state', () => {
    const state = reducer(undefined, setActiveProviderCode('RUT'));
    const result = reducer(state, setActiveMapBaseLayer('terrain'));
    expect(result.activeProviderCode).toBe('RUT');
    expect(result.activeMapBaseLayer).toBe('terrain');
  });
});
