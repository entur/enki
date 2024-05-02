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

global.fetch = vi.fn();

function createFetchResponse(data: any) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}

describe('fetchConfig', () => {
  beforeEach(() => {
    global.fetch.mockReset();
  });

  it('should return the default config', async () => {
    fetch.mockResolvedValue(createFetchResponse({}));
    expect(await fetchConfig()).toEqual(defaultConfig);
  });

  it('should allow overrides', async () => {
    fetch.mockResolvedValue(createFetchResponse({}));
    import.meta.env.VITE_REACT_APP_UTTU_API_URL = 'http://foo/bar';
    expect((await fetchConfig()).uttuApiUrl).toEqual('http://foo/bar');
    delete import.meta.env.VITE_REACT_APP_UTTU_API_URL;
  });

  it('should use bootstrap config', async () => {
    fetch.mockResolvedValue(
      createFetchResponse({
        uttuApiUrl: 'http://other/bar',
      }),
    );
    expect((await fetchConfig()).uttuApiUrl).toEqual('http://other/bar');
  });
});
