import { useQuery } from '@apollo/client';
import { Quay, StopPlace } from 'api';
import { STOP_PLACE_BY_QUAY_REF_QUERY } from 'api/uttu/queries';

interface StopPlaceByQuayRef {
  stopPlaceByQuayRef: StopPlace;
}

export const useQuaySearch = (
  initialQuayRef?: string | null,
  quayRefInput?: string | null,
  alreadyFetchedStopPlacesInJourneyPattern?: StopPlace[],
) => {
  const alreadyFetchedStopPoint = (
    alreadyFetchedStopPlacesInJourneyPattern || []
  ).find(
    (stop) =>
      stop.quays.filter(
        (q) => q.id === (quayRefInput ? quayRefInput : initialQuayRef),
      ).length > 0,
  );

  const { loading, data, refetch } = useQuery<StopPlaceByQuayRef>(
    STOP_PLACE_BY_QUAY_REF_QUERY,
    {
      variables: {
        id: initialQuayRef,
      },
      skip: !initialQuayRef || !!alreadyFetchedStopPoint,
    },
  );

  const foundStopPlace = data?.stopPlaceByQuayRef || alreadyFetchedStopPoint;
  const foundQuay = foundStopPlace?.quays?.find(
    (q: Quay) => q.id === (quayRefInput ? quayRefInput : initialQuayRef),
  );

  return { stopPlace: foundStopPlace, quay: foundQuay, refetch, loading };
};
