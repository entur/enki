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
    console.log('fetchDayTypes useEffect');
    const fetchDayTypes = async () => {
      console.log('fetchDayTypes useEffect - inside fetch');
      const { data } = await apolloClient.query<DayTypesByIdsData>({
        query: GET_DAY_TYPES_BY_IDS,
        variables: { ids: dayTypes.map((dt) => dt.id) },
      });

      setServiceJourneysPerDayType((current) =>
        data.dayTypesByIds.reduce(
          (prev, curr) => {
            prev[curr.id!] = curr.numberOfServiceJourneys!;
            return prev;
          },
          { ...current }
        )
      );
    };

    fetchDayTypes();
  }, [dayTypes, apolloClient, setServiceJourneysPerDayType]);

  return serviceJourneysPerDayType;
};
