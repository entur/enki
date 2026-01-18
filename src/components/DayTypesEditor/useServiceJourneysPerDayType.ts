import { useApolloClient } from '@apollo/client/react';
import { GET_DAY_TYPES_BY_IDS } from 'api/uttu/queries';
import DayType from 'model/DayType';
import { useEffect, useState } from 'react';

type DayTypesByIdsData = {
  dayTypesByIds: DayType[];
};

/**
 * Merges service journey counts from fetched day types into existing counts.
 * Extracted to reduce function nesting depth (SonarQube S2004).
 */
export const mergeServiceJourneyCounts = (
  current: Record<string, number>,
  dayTypes: DayType[],
): Record<string, number> => {
  return dayTypes.reduce(
    (prev, curr) => {
      prev[curr.id!] = curr.numberOfServiceJourneys!;
      return prev;
    },
    { ...current },
  );
};

export const useServiceJourneysPerDayType = (dayTypes: DayType[]) => {
  const [serviceJourneysPerDayType, setServiceJourneysPerDayType] = useState<
    Record<string, number>
  >({});
  const apolloClient = useApolloClient();

  useEffect(() => {
    const fetchDayTypes = async () => {
      const { data } = await apolloClient.query<DayTypesByIdsData>({
        query: GET_DAY_TYPES_BY_IDS,
        variables: { ids: dayTypes.map((dt) => dt.id) },
      });

      if (data) {
        setServiceJourneysPerDayType((current) =>
          mergeServiceJourneyCounts(current, data.dayTypesByIds),
        );
      }
    };

    fetchDayTypes();
  }, [dayTypes, apolloClient, setServiceJourneysPerDayType]);

  return serviceJourneysPerDayType;
};
