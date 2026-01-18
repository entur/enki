import {
  getRouteGeometryFetchPromises,
  getStopPointLocationSequenceWithRouteGeometry,
} from '../helpers';
import { JourneyPatternsMapState, ServiceLink } from '../types';
import { useEffect, useRef } from 'react';
import { getServiceLinkQuery } from '../../../api/uttu/queries';
import { Centroid, UttuQuery } from '../../../api';
import { VEHICLE_MODE } from '../../../model/enums';
import { useAuth } from '../../../auth/auth';
import { useConfig } from '../../../config/ConfigContext';
import { useAppSelector } from '../../../store/hooks';
import StopPoint from '../../../model/StopPoint';

/**
 * Service links contain intermediate locations within a pair of stop points;
 * This allows having a polyline that more realistically follows the shape of the route
 * @param pointsInSequence
 * @param quayLocationsIndex
 * @param setMapState
 * @param mode
 */
export const useRouteGeometry = (
  pointsInSequence: StopPoint[],
  quayLocationsIndex: Record<string, Centroid>,
  setMapState: (state: Partial<JourneyPatternsMapState>) => void,
  mode: VEHICLE_MODE,
) => {
  const serviceLinksIndex = useRef<Record<string, number[][]>>({});
  const activeProvider =
    useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
  const { uttuApiUrl } = useConfig();
  const auth = useAuth();

  const fetchRouteGeometry = async ({
    quayRefFrom,
    quayRefTo,
    mode,
  }: {
    quayRefFrom: string;
    quayRefTo: string;
    mode: VEHICLE_MODE;
  }) => {
    const token = await auth.getAccessToken();
    return await UttuQuery(
      uttuApiUrl,
      activeProvider,
      getServiceLinkQuery,
      { quayRefFrom, quayRefTo, mode },
      token,
    );
  };

  useEffect(() => {
    const fetchRouteGeometryPromises = getRouteGeometryFetchPromises(
      pointsInSequence,
      quayLocationsIndex,
      fetchRouteGeometry,
      serviceLinksIndex.current,
      mode,
    ).filter((promise): promise is Promise<any> => promise !== undefined);
    const newServiceLinkRefs: Record<string, number[][]> = {};

    Promise.all(fetchRouteGeometryPromises).then((serviceLinkResponses) => {
      serviceLinkResponses.forEach((data) => {
        const serviceLink = data?.serviceLink as ServiceLink;
        if (
          serviceLink?.serviceLinkRef &&
          serviceLink?.routeGeometry?.coordinates
        ) {
          newServiceLinkRefs[serviceLink.serviceLinkRef] =
            serviceLink.routeGeometry.coordinates;
        }
      });

      serviceLinksIndex.current = {
        ...serviceLinksIndex.current,
        ...newServiceLinkRefs,
      };

      const stopPointLocationSequence =
        getStopPointLocationSequenceWithRouteGeometry(
          pointsInSequence,
          quayLocationsIndex,
          serviceLinksIndex.current,
        );
      setMapState({ stopPointLocationSequence });
    });
  }, [pointsInSequence, serviceLinksIndex, quayLocationsIndex]);
};
