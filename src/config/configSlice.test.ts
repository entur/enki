import reducer, { updateConfig } from './configSlice';
import { Config } from './config';

describe('configSlice', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ loaded: false });
  });

  it('updateConfig sets loaded to true and spreads config', () => {
    const config: Config = {
      uttuApiUrl: 'https://api.example.com',
      disableAuthentication: false,
    };
    const result = reducer(undefined, updateConfig(config));
    expect(result.loaded).toBe(true);
    expect(result.uttuApiUrl).toBe('https://api.example.com');
    expect(result.disableAuthentication).toBe(false);
  });

  it('updateConfig replaces previous config', () => {
    const first = reducer(
      undefined,
      updateConfig({ uttuApiUrl: 'https://old.example.com' }),
    );
    const second = reducer(
      first,
      updateConfig({ uttuApiUrl: 'https://new.example.com' }),
    );
    expect(second.loaded).toBe(true);
    expect(second.uttuApiUrl).toBe('https://new.example.com');
  });
});
