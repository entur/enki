import { Organisation } from 'model/Organisation';
import reducer, { receiveOrganisations } from './organisationsSlice';

describe('organisationsSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toBeNull();
  });

  it('receiveOrganisations replaces entire state', () => {
    const orgs: Organisation[] = [
      { id: '1', name: { lang: 'en', value: 'Org1' }, type: 'authority' },
      { id: '2', name: { lang: 'en', value: 'Org2' }, type: 'operator' },
    ];
    expect(reducer(null, receiveOrganisations(orgs))).toEqual(orgs);
  });

  it('receiveOrganisations overwrites existing state', () => {
    const initial: Organisation[] = [
      { id: '1', name: { lang: 'en', value: 'Old' }, type: 'authority' },
    ];
    const next: Organisation[] = [
      { id: '2', name: { lang: 'en', value: 'New' }, type: 'operator' },
    ];
    expect(reducer(initial, receiveOrganisations(next))).toEqual(next);
  });
});
