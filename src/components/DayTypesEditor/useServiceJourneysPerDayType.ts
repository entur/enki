import { useApolloClient } from '@apollo/client';
import { GET_DAY_TYPES_BY_IDS } from 'api/uttu/queries';
import DayType from 'model/DayType';
import { useEffect, useState } from 'react';

type DayTypesByIdsData = {
  dayTypesByIds: DayType[];
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

      setServiceJourneysPerDayType(
        data.dayTypesByIds.reduce(
          (prev, curr) => {
            prev[curr.id!] = curr.numberOfServiceJourneys!;
            return prev;
          },
          { ...serviceJourneysPerDayType }
        )
      );
    };

    if (dayTypes.some((v) => !serviceJourneysPerDayType[v.id!])) {
      fetchDayTypes();
    }
  }, [dayTypes]);

  return serviceJourneysPerDayType;
};
