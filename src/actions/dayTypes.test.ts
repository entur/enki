import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import dayTypesReducer from '../reducers/dayTypesSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

vi.mock('graphql', () => ({
  print: vi.fn((doc: any) => 'printed-query'),
}));

import { UttuQuery } from 'api';
import {
  loadDayTypes,
  loadDayTypeById,
  saveDayType,
  deleteDayTypeById,
} from './dayTypes';

const mockIntl: any = {
  formatMessage: (descriptor: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore() {
  return configureStore({
    reducer: {
      dayTypes: dayTypesReducer,
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

describe('dayType actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadDayTypes', () => {
    it('dispatches receiveDayTypes on success', async () => {
      const mockDayTypes = [
        {
          id: '1',
          name: 'Weekdays',
          daysOfWeek: ['monday'],
          dayTypeAssignments: [],
        },
      ];
      vi.mocked(UttuQuery).mockResolvedValue({ dayTypes: mockDayTypes });

      const store = createTestStore();
      await store.dispatch(loadDayTypes(mockIntl) as any);

      expect(store.getState().dayTypes).toEqual(mockDayTypes);
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadDayTypes(mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('loadDayTypeById', () => {
    it('dispatches receiveDayType on success', async () => {
      const mockDayType = {
        id: '1',
        name: 'Weekdays',
        daysOfWeek: ['monday'],
        dayTypeAssignments: [],
      };
      vi.mocked(UttuQuery).mockResolvedValue({
        dayTypesByIds: [mockDayType],
      });

      const store = createTestStore();
      await store.dispatch(loadDayTypeById('1', mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { ids: ['1'] },
        'test-token',
      );
    });

    it('does not dispatch if no results', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({ dayTypesByIds: [] });

      const store = createTestStore();
      await store.dispatch(loadDayTypeById('1', mockIntl) as any);

      expect(store.getState().dayTypes).toBeNull();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadDayTypeById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('saveDayType', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const dayType = {
        name: 'Weekdays',
        daysOfWeek: ['monday'],
        dayTypeAssignments: [],
      };
      await store.dispatch(saveDayType(dayType as any, mockIntl) as any);

      expect(UttuQuery).toHaveBeenCalled();
      expect(store.getState().notification).toMatchObject({
        type: 'success',
      });
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      const dayType = {
        name: 'Weekdays',
        daysOfWeek: ['monday'],
        dayTypeAssignments: [],
      };
      await store.dispatch(saveDayType(dayType as any, mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('deleteDayTypeById', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      await store.dispatch(deleteDayTypeById('1', mockIntl) as any);

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
      await store.dispatch(deleteDayTypeById(undefined, mockIntl) as any);

      expect(UttuQuery).not.toHaveBeenCalled();
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(deleteDayTypeById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });
});
