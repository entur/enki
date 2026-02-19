import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import flexibleStopPlacesReducer from '../reducers/flexibleStopPlacesSlice';
import notificationReducer from '../reducers/notificationSlice';

vi.mock('api', () => ({
  UttuQuery: vi.fn(),
}));

vi.mock('helpers/uttu', () => ({
  getInternationalizedUttuError: vi.fn(() => 'mock error details'),
}));

vi.mock('model/FlexibleStopPlace', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    mapFlexibleAreasToArea: vi.fn((sp: any) => sp),
  };
});

import { UttuQuery } from 'api';
import {
  loadFlexibleStopPlaces,
  loadFlexibleStopPlaceById,
  saveFlexibleStopPlace,
  deleteFlexibleStopPlaceById,
} from './flexibleStopPlaces';

const mockIntl: any = {
  formatMessage: (descriptor: any) =>
    descriptor.id || descriptor.defaultMessage || '',
};

function createTestStore() {
  return configureStore({
    reducer: {
      flexibleStopPlaces: flexibleStopPlacesReducer,
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

describe('flexibleStopPlaces actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadFlexibleStopPlaces', () => {
    it('dispatches requestFlexibleStopPlaces then receiveFlexibleStopPlaces', async () => {
      const mockPlaces = [{ id: '1', name: 'Stop 1' }];
      vi.mocked(UttuQuery).mockResolvedValue({
        flexibleStopPlaces: mockPlaces,
      });

      const store = createTestStore();
      await store.dispatch(loadFlexibleStopPlaces(mockIntl) as any);

      expect(store.getState().flexibleStopPlaces).toEqual(mockPlaces);
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(loadFlexibleStopPlaces(mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('loadFlexibleStopPlaceById', () => {
    it('dispatches receiveFlexibleStopPlace on success', async () => {
      const mockPlace = { id: '1', name: 'Stop 1' };
      vi.mocked(UttuQuery).mockResolvedValue({
        flexibleStopPlace: mockPlace,
      });

      const store = createTestStore();
      await store.dispatch(loadFlexibleStopPlaceById('1', mockIntl) as any);

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
      await store.dispatch(loadFlexibleStopPlaceById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('saveFlexibleStopPlace', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      const place = { id: '1', name: 'Stop Place' };
      await store.dispatch(
        saveFlexibleStopPlace(place as any, mockIntl) as any,
      );

      expect(UttuQuery).toHaveBeenCalledWith(
        'http://test',
        'TST',
        expect.any(String),
        { input: place },
        'test-token',
      );
      expect(store.getState().notification).toMatchObject({
        type: 'success',
      });
    });

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(
        saveFlexibleStopPlace({ name: 'S' } as any, mockIntl) as any,
      );

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });

  describe('deleteFlexibleStopPlaceById', () => {
    it('calls UttuQuery and shows success notification', async () => {
      vi.mocked(UttuQuery).mockResolvedValue({});

      const store = createTestStore();
      await store.dispatch(deleteFlexibleStopPlaceById('1', mockIntl) as any);

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

    it('dispatches error notification on failure', async () => {
      vi.mocked(UttuQuery).mockRejectedValue(new Error('fail'));

      const store = createTestStore();
      await store.dispatch(deleteFlexibleStopPlaceById('1', mockIntl) as any);

      expect(store.getState().notification).toMatchObject({ type: 'error' });
    });
  });
});
