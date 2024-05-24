import { fetchConfig } from './fetchConfig';

const defaultConfig = {
  supportedFlexibleLineTypes: [
    'corridorService',
    'mainRouteWithFlexibleEnds',
    'flexibleAreasOnly',
    'hailAndRideSections',
    'fixedStopAreaWide',
    'mixedFlexible',
    'mixedFlexibleAndFixed',
    'fixed',
  ],
};

describe('fetchConfig', () => {
  it('should return the default config', async () => {
    expect((await fetchConfig()).supportedFlexibleLineTypes).toEqual(
      defaultConfig.supportedFlexibleLineTypes,
    );
  });

  it('should allow overrides', async () => {
    import.meta.env.VITE_REACT_APP_UTTU_API_URL = 'http://foo/bar';
    expect((await fetchConfig()).uttuApiUrl).toEqual('http://foo/bar');
    delete import.meta.env.VITE_REACT_APP_UTTU_API_URL;
  });

  it('should use bootstrap config', async () => {
    expect((await fetchConfig()).uttuApiUrl).toEqual('http://other/bar');
  });
});
