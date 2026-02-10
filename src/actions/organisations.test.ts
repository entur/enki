import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import organisationsReducer from '../reducers/organisationsSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

import { UttuQuery } from 'api';
import { getOrganisations } from './organisations';

function createTestStore(activeProviderCode = 'TST') {
  return configureStore({
    reducer: {
      organisations: organisationsReducer,
      config: (state = { uttuApiUrl: 'http://test' }) => state,
      userContext: (state = { activeProviderCode }) => state,
      auth: (state = { getAccessToken: () => Promise.resolve('test-token') }) =>
        state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

describe('organisation actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrganisations', () => {
    it('dispatches receiveOrganisations on success', async () => {
      const mockOrgs = [{ id: '1', name: 'Org A' }];
      vi.mocked(UttuQuery).mockResolvedValue({ organisations: mockOrgs });

      const store = createTestStore();
      await store.dispatch(getOrganisations() as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        {},
        'test-token',
      );
      expect(store.getState().organisations).toEqual(mockOrgs);
    });

    it('does not call UttuQuery if no active provider', async () => {
      const store = createTestStore('');
      await store.dispatch(getOrganisations() as any);

      expect(UttuQuery).not.toHaveBeenCalled();
    });

    it('silently handles errors', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      // Should not throw
      await store.dispatch(getOrganisations() as any);

      expect(store.getState().organisations).toBeNull();
    });
  });
});
