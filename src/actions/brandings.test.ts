import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import brandingsReducer from '../reducers/brandingsSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

import { UttuQuery } from 'api';
import {
  loadBrandings,
  loadBrandingById,
  saveBranding,
  deleteBrandingById,
} from './brandings';

const mockIntl: any = {
  formatMessage: (descriptor: any, values?: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore() {
  return configureStore({
    reducer: {
      brandings: brandingsReducer,
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

describe('branding actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadBrandings', () => {
    it('dispatches receiveBrandings on success', async () => {
      const mockBrandings = [{ id: '1', name: 'Brand A' }];
      vi.mocked(UttuQuery).mockResolvedValue({ brandings: mockBrandings });

      const store = createTestStore();
      await store.dispatch(loadBrandings(mockIntl) as any);

      expect(store.getState().brandings).toEqual(mockBrandings);
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadBrandings(mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('loadBrandingById', () => {
    it('dispatches receiveBranding on success', async () => {
      const mockBranding = { id: '1', name: 'Brand A' };
      vi.mocked(UttuQuery).mockResolvedValue({ branding: mockBranding });

      const store = createTestStore();
      await store.dispatch(loadBrandingById('1', mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { id: '1' },
        'test-token',
      );
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadBrandingById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('saveBranding', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const branding = { name: 'New Brand' };
      await store.dispatch(saveBranding(branding as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { input: branding },
        'test-token',
      );
      expect(store.getState().notification).toMatchObject({
        type: 'success',
      });
    });

    it('does not show success when showConfirm is false', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      await store.dispatch(
        saveBranding({ name: 'B' } as any, mockIntl, false) as any,
      );

      expect(store.getState().notification).toBeNull();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(saveBranding({ name: 'B' } as any, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('deleteBrandingById', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      await store.dispatch(deleteBrandingById('1', mockIntl) as any);

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
      await store.dispatch(deleteBrandingById(undefined, mockIntl) as any);

      expect(UttuQuery).not.toHaveBeenCalled();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(deleteBrandingById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });
});
