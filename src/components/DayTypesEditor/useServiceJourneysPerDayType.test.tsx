import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { GET_DAY_TYPES_BY_IDS } from 'api/uttu/queries';
import { ReactNode } from 'react';
import { createDayType, resetIdCounters } from 'test/factories';
import {
  mergeServiceJourneyCounts,
  useServiceJourneysPerDayType,
} from './useServiceJourneysPerDayType';

/**
 * @vitest-environment jsdom
 */

describe('mergeServiceJourneyCounts', () => {
  describe('with empty current state', () => {
    it('should create new record from day types', () => {
      const current: Record<string, number> = {};
      const dayTypes = [
        { id: 'dt1', numberOfServiceJourneys: 5 },
        { id: 'dt2', numberOfServiceJourneys: 10 },
      ];

      const result = mergeServiceJourneyCounts(current, dayTypes as any);

      expect(result).toEqual({
        dt1: 5,
        dt2: 10,
      });
    });

    it('should return empty record when day types array is empty', () => {
      const current: Record<string, number> = {};
      const dayTypes: any[] = [];

      const result = mergeServiceJourneyCounts(current, dayTypes);

      expect(result).toEqual({});
    });
  });

  describe('with existing state', () => {
    it('should merge new counts with existing counts', () => {
      const current: Record<string, number> = {
        existing1: 3,
        existing2: 7,
      };
      const dayTypes = [{ id: 'new1', numberOfServiceJourneys: 15 }];

      const result = mergeServiceJourneyCounts(current, dayTypes as any);

      expect(result).toEqual({
        existing1: 3,
        existing2: 7,
        new1: 15,
      });
    });

    it('should overwrite existing counts for same id', () => {
      const current: Record<string, number> = {
        dt1: 3,
      };
      const dayTypes = [{ id: 'dt1', numberOfServiceJourneys: 10 }];

      const result = mergeServiceJourneyCounts(current, dayTypes as any);

      expect(result).toEqual({
        dt1: 10,
      });
    });

    it('should not mutate the current state object', () => {
      const current: Record<string, number> = { dt1: 5 };
      const dayTypes = [{ id: 'dt2', numberOfServiceJourneys: 10 }];

      const result = mergeServiceJourneyCounts(current, dayTypes as any);

      expect(current).toEqual({ dt1: 5 });
      expect(result).not.toBe(current);
    });
  });
});

describe('useServiceJourneysPerDayType', () => {
  beforeEach(() => {
    resetIdCounters();
  });

  const createWrapper = (mocks: any[]) => {
    return ({ children }: { children: ReactNode }) => (
      <MockedProvider
        mocks={mocks}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        {children}
      </MockedProvider>
    );
  };

  it('should return empty object initially', () => {
    const dayTypes = [createDayType({ id: 'dt1' })];
    const mocks = [
      {
        request: {
          query: GET_DAY_TYPES_BY_IDS,
          variables: { ids: ['dt1'] },
        },
        result: {
          data: {
            dayTypesByIds: [{ id: 'dt1', numberOfServiceJourneys: 5 }],
          },
        },
      },
    ];

    const { result } = renderHook(
      () => useServiceJourneysPerDayType(dayTypes),
      {
        wrapper: createWrapper(mocks),
      },
    );

    expect(result.current).toEqual({});
  });

  it('should fetch and return service journey counts', async () => {
    const dayTypes = [
      createDayType({ id: 'dt1' }),
      createDayType({ id: 'dt2' }),
    ];
    const mocks = [
      {
        request: {
          query: GET_DAY_TYPES_BY_IDS,
          variables: { ids: ['dt1', 'dt2'] },
        },
        result: {
          data: {
            dayTypesByIds: [
              { id: 'dt1', numberOfServiceJourneys: 5 },
              { id: 'dt2', numberOfServiceJourneys: 12 },
            ],
          },
        },
      },
    ];

    const { result } = renderHook(
      () => useServiceJourneysPerDayType(dayTypes),
      {
        wrapper: createWrapper(mocks),
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        dt1: 5,
        dt2: 12,
      });
    });
  });

  it('should handle empty day types array', async () => {
    const dayTypes: any[] = [];
    const mocks = [
      {
        request: {
          query: GET_DAY_TYPES_BY_IDS,
          variables: { ids: [] },
        },
        result: {
          data: {
            dayTypesByIds: [],
          },
        },
      },
    ];

    const { result } = renderHook(
      () => useServiceJourneysPerDayType(dayTypes),
      {
        wrapper: createWrapper(mocks),
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual({});
    });
  });

  it('should update when day types change', async () => {
    const initialDayTypes = [createDayType({ id: 'dt1' })];
    const updatedDayTypes = [
      createDayType({ id: 'dt1' }),
      createDayType({ id: 'dt2' }),
    ];

    const mocks = [
      {
        request: {
          query: GET_DAY_TYPES_BY_IDS,
          variables: { ids: ['dt1'] },
        },
        result: {
          data: {
            dayTypesByIds: [{ id: 'dt1', numberOfServiceJourneys: 5 }],
          },
        },
      },
      {
        request: {
          query: GET_DAY_TYPES_BY_IDS,
          variables: { ids: ['dt1', 'dt2'] },
        },
        result: {
          data: {
            dayTypesByIds: [
              { id: 'dt1', numberOfServiceJourneys: 5 },
              { id: 'dt2', numberOfServiceJourneys: 8 },
            ],
          },
        },
      },
    ];

    const { result, rerender } = renderHook(
      ({ dayTypes }) => useServiceJourneysPerDayType(dayTypes),
      {
        wrapper: createWrapper(mocks),
        initialProps: { dayTypes: initialDayTypes },
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual({ dt1: 5 });
    });

    rerender({ dayTypes: updatedDayTypes });

    await waitFor(() => {
      expect(result.current).toEqual({ dt1: 5, dt2: 8 });
    });
  });
});
