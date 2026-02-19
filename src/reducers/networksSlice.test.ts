import { Network } from 'model/Network';
import reducer, { receiveNetworks, receiveNetwork } from './networksSlice';

describe('networksSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('receiveNetworks replaces entire state', () => {
    const networks: Network[] = [
      { id: '1', name: 'Net1', authorityRef: 'auth1' },
      { id: '2', name: 'Net2', authorityRef: 'auth2' },
    ];
    expect(reducer(null, receiveNetworks(networks))).toEqual(networks);
  });

  it('receiveNetworks overwrites existing state', () => {
    const initial: Network[] = [{ id: '1', name: 'Old', authorityRef: 'a' }];
    const next: Network[] = [{ id: '2', name: 'New', authorityRef: 'b' }];
    expect(reducer(initial, receiveNetworks(next))).toEqual(next);
  });

  it('receiveNetwork updates existing by id', () => {
    const initial: Network[] = [
      { id: '1', name: 'Old', authorityRef: 'a' },
      { id: '2', name: 'Keep', authorityRef: 'b' },
    ];
    const updated: Network = { id: '1', name: 'New', authorityRef: 'a' };
    const result = reducer(initial, receiveNetwork(updated));
    expect(result).toEqual([
      { id: '1', name: 'New', authorityRef: 'a' },
      { id: '2', name: 'Keep', authorityRef: 'b' },
    ]);
  });

  it('receiveNetwork returns singleton when state is null', () => {
    const network: Network = { id: '1', name: 'New', authorityRef: 'a' };
    expect(reducer(null, receiveNetwork(network))).toEqual([network]);
  });

  it('receiveNetwork leaves non-matching items unchanged', () => {
    const initial: Network[] = [{ id: '1', name: 'A', authorityRef: 'a' }];
    const other: Network = { id: '99', name: 'B', authorityRef: 'b' };
    const result = reducer(initial, receiveNetwork(other));
    expect(result).toEqual([{ id: '1', name: 'A', authorityRef: 'a' }]);
  });
});
