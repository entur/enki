import { MockedFunction } from 'vitest';
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

const fetchMock: MockedFunction<typeof global.fetch> = vi.fn(global.fetch);

global.fetch = fetchMock;

function createFetchResponse(data: any) {
  return { json: () => new Promise((resolve) => resolve(data)) } as Response;
}

describe('fetchConfig', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should return the default config', async () => {
    fetchMock.mockResolvedValue(createFetchResponse({}));
    expect(await fetchConfig()).toEqual(defaultConfig);
  });

  it('should allow overrides', async () => {
    fetchMock.mockResolvedValue(createFetchResponse({}));
    import.meta.env.VITE_REACT_APP_UTTU_API_URL = 'http://foo/bar';
    expect((await fetchConfig()).uttuApiUrl).toEqual('http://foo/bar');
    delete import.meta.env.VITE_REACT_APP_UTTU_API_URL;
  });

  it('should use bootstrap config', async () => {
    fetchMock.mockResolvedValue(
      createFetchResponse({
        uttuApiUrl: 'http://other/bar',
      }),
    );
    expect((await fetchConfig()).uttuApiUrl).toEqual('http://other/bar');
  });
});
