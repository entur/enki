export const getProvidersQuery = `
  query GetProviders {
    providers {
      name,
      code
    }
  }
`;

export const getNetworksQuery = `
  query GetNetworks {
    networks {
      id,
      name,
      description,
      privateCode,
      authorityRef
    }
  }
`;

export const getNetworkByIdQuery = `
  query GetNetworkById($id:ID!) {
    network(id: $id) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      description,
      privateCode,
      authorityRef
    }
  }
`;

export const getFlexibleLinesQuery = `
  query GetFlexibleLines {
    flexibleLines {
      publicCode,
      network { id },
      operatorRef,
      journeyPatterns {
        pointsInSequence {
          flexibleStopPlace { id },
          destinationDisplay { frontText }
        },
        serviceJourneys {
          passingTimes {
            latestArrivalTime,
            earliestDepartureTime
          },
          dayTypes {
            dayTypeAssignments {
              isAvailable,
              date,
              operatingPeriod {
                fromDate,
                toDate
              }
            }
          }
        }
      }
    }
  }
`;

export const getFlexibleStopPlacesQuery = `
  query GetFlexibleStopPlaces {
    flexibleStopPlaces {
      id,
      name,
      description,
      privateCode,
      transportMode,
      flexibleArea {
        polygon {
          coordinates
        }
      }
    }
  }
`;

export const getFlexibleStopPlaceByIdQuery = `
  query GetFlexibleStopPlaceById($id:ID!) {
    flexibleStopPlace(id: $id) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      description,
      privateCode,
      transportMode,
      flexibleArea {
        polygon {
          type,
          coordinates
        }
      }
    }
  }
`;
