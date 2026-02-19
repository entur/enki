import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import exportsReducer from '../reducers/exportsSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

vi.mock('model/Export', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    toPayload: vi.fn((e: any) => ({ name: e.name, dryRun: e.dryRun })),
  };
});

import { UttuQuery } from 'api';
import { loadExports, loadExportById, saveExport } from './exports';

const mockIntl: any = {
  formatMessage: (descriptor: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore() {
  return configureStore({
    reducer: {
      exports: exportsReducer,
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

describe('export actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadExports', () => {
    it('dispatches requestExports then receiveExports on success', async () => {
      const mockExports = [
        {
          id: '1',
          name: 'Export 1',
          dryRun: false,
          created: '2024-01-01',
        },
      ];
      vi.mocked(UttuQuery).mockResolvedValue({ exports: mockExports });

      const store = createTestStore();
      await store.dispatch(loadExports(mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { historicDays: 365 },
        'test-token',
      );
      // exports state should be set (sorted by date)
      expect(store.getState().exports).not.toBeNull();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadExports(mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('loadExportById', () => {
    it('dispatches receiveExport on success', async () => {
      const mockExport = { id: '1', name: 'Export 1', dryRun: false };
      vi.mocked(UttuQuery).mockResolvedValue({ export: mockExport });

      const store = createTestStore();
      await store.dispatch(loadExportById('1', mockIntl) as any);

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
      await store.dispatch(loadExportById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('saveExport', () => {
    it('calls UttuQuery with export mutation', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const theExport = {
        name: 'My Export',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
      };
      await store.dispatch(saveExport(theExport as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { input: expect.any(Object) },
        'test-token',
      );
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      const theExport = {
        name: 'Export',
        dryRun: false,
        generateServiceLinks: true,
        includeDatedServiceJourneys: false,
      };
      await store.dispatch(saveExport(theExport as any, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });
});
