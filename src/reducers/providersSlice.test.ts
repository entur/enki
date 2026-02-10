import Provider from 'model/Provider';
import reducer, {
  receiveProviders,
  failedReceivingProviders,
} from './providersSlice';

describe('providersSlice', () => {
  const initialState = { providers: null, failure: false, exports: null };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('receiveProviders sets providers and clears failure', () => {
    const providers: Provider[] = [
      { name: 'Provider1', code: 'P1' },
      { name: 'Provider2', code: 'P2' },
    ];
    const result = reducer(
      { providers: null, failure: true, exports: null },
      receiveProviders(providers),
    );
    expect(result.providers).toEqual(providers);
    expect(result.failure).toBe(false);
  });

  it('failedReceivingProviders sets failure to true', () => {
    const result = reducer(initialState, failedReceivingProviders());
    expect(result.failure).toBe(true);
    expect(result.providers).toBeNull();
  });

  it('receiveProviders after failure clears failure flag', () => {
    const failed = reducer(initialState, failedReceivingProviders());
    const result = reducer(
      failed,
      receiveProviders([{ name: 'P', code: 'p' }]),
    );
    expect(result.failure).toBe(false);
    expect(result.providers).toHaveLength(1);
  });
});
