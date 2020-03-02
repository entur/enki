import { request } from 'graphql-request';

export default async function search(quayRef) {
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
    quayRef
  };

  const data = await request(endpoint, query, variables);
  let foundQuay = 'not-found',
    foundStopPlace = 'not-found';
  data.stopPlace.forEach(stop => {
    (stop.quays || []).forEach(quay => {
      if (quay.id === quayRef) {
        foundStopPlace = stop;
        foundQuay = quay;
      }
    });
  });
  return { stopPlace: foundStopPlace, quay: foundQuay };
}
