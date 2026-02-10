import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import networksReducer from '../reducers/networksSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

import { UttuQuery } from 'api';
import {
  loadNetworks,
  loadNetworkById,
  saveNetwork,
  deleteNetworkById,
} from './networks';

const mockIntl: any = {
  formatMessage: (descriptor: any, values?: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore(overrides: Record<string, any> = {}) {
  return configureStore({
    reducer: {
      networks: networksReducer,
      notification: notificationReducer,
      config: (state = { uttuApiUrl: 'http://test' }) => state,
      userContext: (state = { activeProviderCode: 'TST' }) => state,
      auth: (state = { getAccessToken: () => Promise.resolve('test-token') }) =>
        state,
      ...overrides,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

describe('network actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadNetworks', () => {
    it('dispatches receiveNetworks on success', async () => {
      const mockNetworks = [
        { id: '1', name: 'Network 1', authorityRef: 'auth:1' },
      ];
      vi.mocked(UttuQuery).mockResolvedValue({ networks: mockNetworks });

      const store = createTestStore();
      await store.dispatch(loadNetworks(mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        {},
        'test-token',
      );
      expect(store.getState().networks).toEqual(mockNetworks);
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('Network error'));

      const store = createTestStore();
      await store.dispatch(loadNetworks(mockIntl) as any);

      expect(store.getState().notification).toMatchObject({
        type: 'error',
      });
    });
  });

  describe('loadNetworkById', () => {
    it('dispatches receiveNetwork on success', async () => {
      const mockNetwork = { id: '1', name: 'Net', authorityRef: 'auth:1' };
      vi.mocked(UttuQuery).mockResolvedValue({ network: mockNetwork });

      const store = createTestStore();
      await store.dispatch(loadNetworkById('1', mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { id: '1' },
        'test-token',
      );
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('Not found'));

      const store = createTestStore();
      await store.dispatch(loadNetworkById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({
        type: 'error',
      });
    });
  });

  describe('saveNetwork', () => {
    it('calls UttuQuery with network mutation and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const network = { name: 'New Net', authorityRef: 'auth:1' };
      await store.dispatch(saveNetwork(network, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { input: network },
        'test-token',
      );
      expect(store.getState().notification).toMatchObject({
        type: 'success',
      });
    });

    it('does not show success notification when showConfirm is false', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const network = { name: 'Net', authorityRef: 'auth:1' };
      await store.dispatch(saveNetwork(network, mockIntl, false) as any);

      expect(store.getState().notification).toBeNull();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('Save failed'));

      const store = createTestStore();
      const network = { name: 'Net', authorityRef: 'auth:1' };
      await store.dispatch(saveNetwork(network, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({
        type: 'error',
      });
    });
  });

  describe('deleteNetworkById', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      await store.dispatch(deleteNetworkById('1', mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { id: '1' },
        'test-token',
      );
      expect(store.getState().notification).toMatchObject({
        type: 'success',
      });
    });

    it('does nothing when id is undefined', async () => {
      const store = createTestStore();
      await store.dispatch(deleteNetworkById(undefined, mockIntl) as any);

      expect(UttuQuery).not.toHaveBeenCalled();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('Delete failed'));

      const store = createTestStore();
      await store.dispatch(deleteNetworkById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({
        type: 'error',
      });
    });
  });
});
