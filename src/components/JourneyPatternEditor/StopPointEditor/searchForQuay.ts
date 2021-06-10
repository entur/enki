import {
  StopPlacesRead,
  StopPlacesQuery,
  StopPlace,
  Quay,
  SearchForQuayResponse,
} from 'api';

export type QuaySearch = { stopPlace?: StopPlace; quay?: Quay };

export default async function search(quayRef: string): Promise<QuaySearch> {
  if (window.location.hostname === 'nplan.dev.entur.org') {
    return searchWithTiamat(quayRef);
  }
  return searchWithReadApi(quayRef);
}

const searchWithReadApi = async (quayRef: string): Promise<QuaySearch> => {
  const endpoint = `/api/stopPlacesRead/quays/${quayRef}/stop-place`;

  const data = await StopPlacesRead(endpoint);

  let foundQuay = undefined,
    foundStopPlace = undefined;

  if (data) {
    foundStopPlace = data;
    foundQuay = data.quays?.quayRefOrQuay.find((q: Quay) => q.id === quayRef);
  }

  return { stopPlace: foundStopPlace, quay: foundQuay };
};

const searchWithTiamat = async (quayRef: string): Promise<QuaySearch> => {
  const endpoint = '/api/stopPlaces';

  const query = /* GraphQL */ `
    query getQuay($quayRef: String!) {
      stopPlace(query: $quayRef) {
        id
        name {
          value
        }
        ... on ParentStopPlace {
          children {
            id
            name {
              value
            }
            quays {
              id
              publicCode
              name {
                value
              }
            }
          }
        }
        ... on StopPlace {
          quays {
            id
            publicCode
            name {
              value
            }
          }
        }
      }
    }
  `;

  const variables = {
    quayRef,
  };

  const data: null | SearchForQuayResponse = await StopPlacesQuery(
    endpoint,
    query,
    variables
  );
  let foundQuay = undefined,
    foundStopPlace = undefined;

  data?.stopPlace?.forEach((stop) => {
    stop.children?.forEach((child) => {
      (child.quays || []).forEach((quay) => {
        if (quay.id === quayRef) {
          foundStopPlace = child;
          foundQuay = quay;
        }
      });
    });
    (stop.quays || []).forEach((quay) => {
      if (quay.id === quayRef) {
        foundStopPlace = stop;
        foundQuay = quay;
      }
    });
  });
  return { stopPlace: foundStopPlace, quay: foundQuay };
};
