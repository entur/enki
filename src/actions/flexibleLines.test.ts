import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import flexibleLinesReducer from '../reducers/flexibleLinesSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

vi.mock('helpers/flexibleLines', () => ({
  normalizeFlexibleLineFromApi: vi.fn((line: any) => line),
}));

import { UttuQuery } from 'api';
import {
  loadFlexibleLines,
  loadFlexibleLineById,
  saveFlexibleLine,
  deleteLine,
} from './flexibleLines';

const mockIntl: any = {
  formatMessage: (descriptor: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore() {
  return configureStore({
    reducer: {
      flexibleLines: flexibleLinesReducer,
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

describe('flexibleLines actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadFlexibleLines', () => {
    it('dispatches receiveFlexibleLines on success', async () => {
      const mockLines = [{ id: '1', name: 'Line 1' }];
      vi.mocked(UttuQuery).mockResolvedValue({
        flexibleLines: mockLines,
      });

      const store = createTestStore();
      await store.dispatch(loadFlexibleLines(mockIntl) as any);

      expect(store.getState().flexibleLines).toEqual(mockLines);
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadFlexibleLines(mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('loadFlexibleLineById', () => {
    it('dispatches receiveFlexibleLine for flexible line', async () => {
      const mockLine = {
        id: '1',
        name: 'Flex Line',
        flexibleLineType: 'flexibleAreasOnly',
      };
      vi.mocked(UttuQuery).mockResolvedValue({
        flexibleLine: mockLine,
        line: null,
      });

      const store = createTestStore();
      await store.dispatch(loadFlexibleLineById('1', true, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { id: '1' },
        'test-token',
      );
    });

    it('dispatches receiveFlexibleLine for fixed line', async () => {
      const mockLine = { id: '2', name: 'Fixed Line' };
      vi.mocked(UttuQuery).mockResolvedValue({
        flexibleLine: null,
        line: mockLine,
      });

      const store = createTestStore();
      await store.dispatch(loadFlexibleLineById('2', false, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalled();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadFlexibleLineById('1', true, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('saveFlexibleLine', () => {
    it('shows success notification for new flexible line', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const line = {
        name: 'New Line',
        flexibleLineType: 'flexibleAreasOnly',
        journeyPatterns: [],
      };
      await store.dispatch(saveFlexibleLine(line as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalled();
      expect(store.getState().notification).toMatchObject({
        type: 'success',
        showModal: true,
      });
    });

    it('shows success notification for existing line', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const line = {
        id: '1',
        name: 'Existing',
        flexibleLineType: 'flexibleAreasOnly',
        journeyPatterns: [],
      };
      await store.dispatch(saveFlexibleLine(line as any, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({
        type: 'success',
        showModal: false,
      });
    });

    it('uses lineMutation for non-flexible lines', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const line = {
        id: '1',
        name: 'Fixed',
        journeyPatterns: [],
      };
      await store.dispatch(saveFlexibleLine(line as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalled();
    });

    it('dispatches error notification and rethrows on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('save fail'));

      const store = createTestStore();
      const line = {
        name: 'Line',
        flexibleLineType: 'flexibleAreasOnly',
        journeyPatterns: [],
      };

      await expect(
        store.dispatch(saveFlexibleLine(line as any, mockIntl) as any),
      ).rejects.toThrow('save fail');

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('deleteLine', () => {
    it('shows success notification on delete', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const line = {
        id: '1',
        name: 'Line',
        flexibleLineType: 'flexibleAreasOnly',
      };
      await store.dispatch(deleteLine(line as any, mockIntl) as any);

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

    it('uses deleteline for non-flexible lines', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const line = { id: '2', name: 'Fixed Line' };
      await store.dispatch(deleteLine(line as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalled();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      const line = {
        id: '1',
        name: 'Line',
        flexibleLineType: 'flexibleAreasOnly',
      };
      await store.dispatch(deleteLine(line as any, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });
});
