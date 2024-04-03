import { useQuery } from '@apollo/client';
import { Quay, StopPlace } from 'api';
import { STOP_PLACE_BY_QUAY_REF_QUERY } from 'api/uttu/queries';

interface StopPlaceByQuayRef {
  stopPlaceByQuayRef: StopPlace;
}

export const useQuaySearch = (
  initialQuayRef?: string | null,
  quayRefInput?: string | null,
) => {
  const { loading, data, refetch } = useQuery<StopPlaceByQuayRef>(
    STOP_PLACE_BY_QUAY_REF_QUERY,
    {
      variables: {
        id: initialQuayRef,
      },
      skip: !initialQuayRef,
    },
  );

  let foundQuay = undefined,
    foundStopPlace = undefined;

  if (data?.stopPlaceByQuayRef) {
    foundStopPlace = data.stopPlaceByQuayRef;
    foundQuay = data.stopPlaceByQuayRef.quays?.find(
      (q: Quay) => q.id === (quayRefInput ? quayRefInput : initialQuayRef),
    );
  }

  return { stopPlace: foundStopPlace, quay: foundQuay, refetch, loading };
};
