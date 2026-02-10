import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import providersReducer from '../reducers/providersSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getStyledUttuError: vi.fn(() => 'styled error'),
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

import { UttuQuery } from 'api';
import { getProviders, saveProvider } from './providers';

const mockIntl: any = {
  formatMessage: (descriptor: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore() {
  return configureStore({
    reducer: {
      providers: providersReducer,
      notification: notificationReducer,
      config: (state = { uttuApiUrl: 'http://test' }) => state,
      userContext: (state = { activeProviderCode: 'TST' }) => state,
      auth: (state = { getAccessToken: () => Promise.resolve('test-token') }) =>
        state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

describe('provider actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProviders', () => {
    it('dispatches receiveProviders on success', async () => {
      const mockProviders = [{ id: '1', name: 'Provider A', code: 'PA' }];
      vi.mocked(UttuQuery).mockResolvedValue({ providers: mockProviders });

      const store = createTestStore();
      await store.dispatch(getProviders() as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'providers',
        expect.any(String),
        {},
        'test-token',
      );
      expect(store.getState().providers.providers).toEqual(mockProviders);
      expect(store.getState().providers.failure).toBe(false);
    });

    it('dispatches failedReceivingProviders on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(getProviders() as any).catch(() => {});

      expect(store.getState().providers.failure).toBe(true);
    });
  });

  describe('saveProvider', () => {
    it('calls UttuQuery twice (codespace + provider)', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const provider = {
        name: 'Test Provider',
        code: 'TP',
        codespace: { xmlns: 'TP', xmlnsUrl: 'http://tp' },
      };
      await store.dispatch(saveProvider(provider as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledTimes(2);
      // First call: mutate codespace
      expect(UttuQuery).toHaveBeenNthCalledWith(
        1,
        'http://test',
        'providers',
        expect.any(String),
        { input: provider.codespace },
        'test-token',
      );
      // Second call: mutate provider
      expect(UttuQuery).toHaveBeenNthCalledWith(
        2,
        'http://test',
        'providers',
        expect.any(String),
        {
          input: {
            name: 'Test Provider',
            code: 'TP',
            codespaceXmlns: 'TP',
          },
        },
        'test-token',
      );
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      const provider = {
        name: 'P',
        code: 'P',
        codespace: { xmlns: 'P', xmlnsUrl: 'http://p' },
      };
      await store.dispatch(saveProvider(provider as any, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });
});
