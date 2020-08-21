import { StopPlacesQuery } from 'api';

export type Quay = {
  id: string;
  publicCode: null | string;
  name: null | string;
};

export type StopPlace = {
  id: string;
  name: { value: string };
  quays: Quay[];
};

export type SearchForQuayResponse = {
  stopPlace: null | StopPlace[];
};

export type QuaySearch = { stopPlace?: StopPlace; quay?: Quay };

export default async function search(quayRef: string): Promise<QuaySearch> {
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
    (stop.quays || []).forEach((quay) => {
      if (quay.id === quayRef) {
        foundStopPlace = stop;
        foundQuay = quay;
      }
    });
  });
  return { stopPlace: foundStopPlace, quay: foundQuay };
}
